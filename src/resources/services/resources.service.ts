import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository  } from "@nestjs/typeorm";
import { UtilsService } from "src/util/utils.service";
import { DataSource, Repository , In  , FindOperator , Raw, Not, ILike} from "typeorm";
import { CreateResourceInput } from "../dto/resource-input.dto";
import ResourceInput, { ResourcesPayload } from "../dto/resource-payload.dto";
import { UpdateResourceInput } from "../dto/update-resource.input";
import { AssessmentType } from "../../AssessmentTypes/entities/assessment-type.entity";
import { ClassRoomNeed } from "../../ClassRoomNeeds/entities/classroom-needs.entity";
import { ContentLink, LinksToContentInput } from "../../ContentLinks/entities/content-link.entity";
import { ContentWarning } from "../../ContentWarnings/entities/content-warning.entity";
import { EvaluationPreference } from "../../EvaluationPreferences/entities/evaluation-preference.entity";
import { Format } from "../../Format/entities/format.entity";
import { Grade } from "../../Grade/entities/grade-levels.entity";
import { Journalist } from "../../Journalists/entities/journalist.entity";
import { NewsLiteracyTopic } from "../../newLiteracyTopic/entities/newliteracy-topic.entity";
import { NLNOTopNavigation } from "../../nlnoTopNavigation/entities/nlno-top-navigation.entity";
import { NlpStandard, NlpStandardInput } from "../../nlpStandards/entities/nlp-standard.entity";
import { Prerequisite } from "../../Prerequisite/entities/prerequisite.entity";
import { ResourceType } from "../../ResourceType/entities/resource-types.entity";
import { Resource } from "../entities/resource.entity";
import { SubjectArea } from "../../subjectArea/entities/subject-areas.entity";
import { ContentLinkService } from "src/ContentLinks/content-link.service";
import { JournalistsService } from "src/Journalists/journalists.service";
import { NLNOTopNavigationService } from "src/nlnoTopNavigation/nlno-top-navigation.service";
import { GradesService } from "src/Grade/grades.service";
import { ClassRoomNeedService } from "src/ClassRoomNeeds/classroom-need.service";
import { SubjectAreaService } from "../../subjectArea/subjectArea.service";
import { PrerequisiteService } from "src/Prerequisite/prerequisite.service";
import { NlpStandardService } from "src/nlpStandards/nlp-standard.service";
import { NewsLiteracyTopicService } from "src/newLiteracyTopic/newsliteracy-topic.service";
import { EvaluationPreferenceService } from "src/EvaluationPreferences/evaluation-preference.service";
import { ContentWarningService } from "../../ContentWarnings/content-warning.service";
import { AssessmentTypeService } from "src/AssessmentTypes/assessment-type.service";
import { removeEmojisFromArray } from "src/lib/helper";
import Airtable, { Base } from "airtable";
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { ResourceTypeService } from "src/ResourceType/resource-type.service";
import { FormatService } from "src/Format/format.service";

@Injectable()
export class ResourcesService {
    // private airtable: Airtable;
    private base: Base;
    private config: AxiosRequestConfig;
    private readonly tableId: string;
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    private readonly contentLinkService: ContentLinkService,
    private readonly journalistsService: JournalistsService,
    private readonly nlnTopNavigationService:NLNOTopNavigationService,
    private readonly gradesService:GradesService,
    private readonly classRooomNeedService:ClassRoomNeedService,
    private readonly subjectAreaService:SubjectAreaService,
    private readonly prerequisiteService:PrerequisiteService,
    private readonly nlpStandardsService:NlpStandardService,
    private readonly newsLiteracyTopicService: NewsLiteracyTopicService,
    private readonly contentWarningService:ContentWarningService,
    private readonly evaluationPreferenceService: EvaluationPreferenceService,
    private readonly assessmentTypeService: AssessmentTypeService,
    private readonly resourceTypeService: ResourceTypeService,
    private readonly configService:ConfigService,
    private readonly formatService:FormatService,
    private utilsService: UtilsService
  ) {
    const airtable = new Airtable({ apiKey: this.configService.get<string>('personalToken')});
    this.base = airtable.base( this.configService.get<string>('baseId'));
    const headers = {Authorization: `Bearer ${ this.configService.get<string>('personalToken')}`,};
    const config: AxiosRequestConfig = {headers}
    this.config = config

  }


  /**
   * 
   * @param createResourceInput 
   * @returns 
   */
  async create(createResourceInput: CreateResourceInput): Promise<Resource>  {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const newResource = this.resourcesRepository.create(createResourceInput);
      newResource.journalist = await this.journalistsService.findAllByNameOrCreate(createResourceInput.journalists);
      newResource.linksToContent = await this.contentLinkService.findAllByNameOrCreate(createResourceInput.linksToContents)
      newResource.resourceType =await this.resourceTypeService.findAllByNameOrCreate(createResourceInput.resourceTypes)
      newResource.nlnoTopNavigation = await this.nlnTopNavigationService. findAllByNameOrCreate(createResourceInput.nlnoTopNavigations)
      newResource.gradeLevel = await this.gradesService.findAllByNameOrCreate(createResourceInput.gradeLevels)
      newResource.classRoomNeed = await this.classRooomNeedService.findAllByNameOrCreate( createResourceInput.classRoomNeeds)
      newResource.subjectArea = await this.subjectAreaService.findAllByNameOrCreate(createResourceInput.subjectAreas)
      newResource.prerequisite = await this.prerequisiteService.findAllByNameOrCreate(createResourceInput.prerequisites)
      newResource.nlpStandard = await this.nlpStandardsService.findAllByNameOrCreate(createResourceInput.nlpStandards)
      newResource.newsLiteracyTopic = await this.newsLiteracyTopicService.findAllByNameOrCreate(createResourceInput.newsLiteracyTopics)
      newResource.evaluationPreference = await this.evaluationPreferenceService.findAllByNameOrCreate(createResourceInput.evaluationPreferences)
      newResource.contentWarning = await this.contentWarningService.findAllByNameOrCreate(createResourceInput.contentWarnings)
      newResource.assessmentType = await this.assessmentTypeService.findAllByNameOrCreate(createResourceInput.assessmentTypes)
      
      await manager.save(newResource);
      await queryRunner.commitTransaction();
      return newResource;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  /**
   * 
   * @param updateResourceInput 
   * @returns 
   */
  async update(updateResourceInput: UpdateResourceInput): Promise<Resource> {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {id} = updateResourceInput;
      const resource = await this.resourcesRepository.findOne({ where: { id } });

      if (!resource) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: `Resource with id: ${updateResourceInput.id} not found`,
        });
      }
      this.resourcesRepository.merge(resource, updateResourceInput);
      resource.journalist = await this.journalistsService.findAllByNameOrCreate(updateResourceInput.journalists)
      resource.linksToContent = await this.contentLinkService.findAllByNameOrCreate(updateResourceInput.linksToContents)
      resource.resourceType = await this.resourceTypeService.findAllByNameOrCreate(updateResourceInput.resourceTypes)
      resource.nlnoTopNavigation = await this.nlnTopNavigationService.findAllByNameOrCreate(updateResourceInput.nlnoTopNavigations)
      resource.gradeLevel = await this.gradesService.findAllByNameOrCreate(updateResourceInput.gradeLevels)
      resource.classRoomNeed = await this.classRooomNeedService.findAllByNameOrCreate(updateResourceInput.classRoomNeeds)
      resource.subjectArea = await this.subjectAreaService.findAllByNameOrCreate(updateResourceInput.subjectAreas)
      resource.prerequisite = await this.prerequisiteService.findAllByNameOrCreate(updateResourceInput.prerequisites)
      resource.nlpStandard = await this.nlpStandardsService.findAllByNameOrCreate(updateResourceInput.nlpStandards)
      resource.newsLiteracyTopic =await this.newsLiteracyTopicService.findAllByNameOrCreate(updateResourceInput.newsLiteracyTopics)
      resource.evaluationPreference = await this.evaluationPreferenceService.findAllByNameOrCreate(updateResourceInput.evaluationPreferences)
      resource.contentWarning = await this.contentWarningService.findAllByNameOrCreate(updateResourceInput.contentWarnings)
      resource.assessmentType = await this.assessmentTypeService.findAllByNameOrCreate(updateResourceInput.assessmentTypes)


      await manager.save(resource);
      await queryRunner.commitTransaction();
      return resource;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Finds one
   * @param id 
   * @returns one 
   */
  async findOne(id: string): Promise<Resource> {
    return await this.resourcesRepository.findOne({ where: { id } });
  }

  /**
   * 
   * @returns 
   */
  async findFilters() {
    try {
      const resources = await this.resourcesRepository.find({
        select: ['estimatedTimeToComplete'],
        where: {
          estimatedTimeToComplete: Not('')
        }
      });
      const duration =Array.from(new Set(resources.map(resource => resource.estimatedTimeToComplete)));
      const journalists = await this.journalistsService.findAllDistinctByName()
      const linksToContents = await this.contentLinkService.findAllDistinctByName()
      const resourceTypes = await  this.resourceTypeService.findAllDistinctByName()
      const nlnoTopNavigations = await this.nlnTopNavigationService.findAllDistinctByName()
      const formats = await this.formatService.findAllDistinctByName()
      const gradeLevels = await this.gradesService.findAllDistinctByName()
      const classRoomNeeds = await this.classRooomNeedService.findAllDistinctByName()
      const subjectAreas = await this.subjectAreaService.findAllDistinctByName()
      const prerequisites = await this.prerequisiteService.findAllDistinctByName()
      const nlpStandards = await this.nlpStandardsService.findAllDistinctByName()
      const newsLiteracyTopics = await this.newsLiteracyTopicService.findAllDistinctByName()
      const evaluationPreferences = await this.evaluationPreferenceService.findAllDistinctByName()
      const contentWarnings = await this.contentWarningService.findAllDistinctByName()
      const assessmentTypes = await this.assessmentTypeService.findAllDistinctByName()

      return {
        duration,
        journalists,
        linksToContents,
        resourceTypes,
        nlnoTopNavigations,
        formats,
        gradeLevels,
        classRoomNeeds,
        subjectAreas,
        prerequisites,
        nlpStandards,
        newsLiteracyTopics,
        evaluationPreferences,
        contentWarnings,
        assessmentTypes
      }

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 
   * @param resourceInput 
   * @returns 
   */
  async find(resourceInput: ResourceInput): Promise<ResourcesPayload> {
    const {limit, page}  = resourceInput.paginationOptions
    const {searchString, orderBy, alphabetic, mostRelevant, estimatedTimeToComplete, resourceTypes, evaluationPreferences, formats, classRoomNeeds, nlpStandards, gradeLevels, subjects, topics} = resourceInput

    // const query = this.resourcesRepository
    const query = this.resourcesRepository.createQueryBuilder('resource');
      
    // filter by most relevant
    if (mostRelevant && searchString) {

      const searchStringLower = searchString.toLowerCase();
      query
      .andWhere(`to_tsvector('english', LOWER(resource.contentTitle)) @@ plainto_tsquery('english', LOWER(:searchString))`, { searchString: searchStringLower })
      .addSelect(`ts_rank(to_tsvector(LOWER(resource.contentTitle)), plainto_tsquery(:searchString))`, 'rank')
      .orderBy('rank', 'DESC');
    }
    //search based on title of content 
    else if (searchString) {
      const searchStringLowerCase = searchString.toLowerCase();
      query.where(`LOWER(resource.contentTitle) ILIKE :searchString`, { searchString: `%${searchStringLowerCase}%` })
    }

    // filter by resource estimated time to complete
    if (estimatedTimeToComplete) {
      const estimatedTimeToCompleteLower = estimatedTimeToComplete.toLowerCase();
      query.andWhere('LOWER(resource.estimatedTimeToComplete) LIKE :estimatedTimeToComplete', { estimatedTimeToComplete: `%${estimatedTimeToCompleteLower}%` });
    }

    // filter by resource type name
    if (resourceTypes) {
      const resourceTypesLower = resourceTypes.map(type => type.toLowerCase());
      query.leftJoinAndSelect('resource.resourceType', 'resourceType');
      query.andWhere('LOWER(resourceType.name) IN (:...resourceTypes)', { resourceTypes: resourceTypesLower })
    }
    

    // filter by resource evaluation Preference
    if (evaluationPreferences) {
      const evaluationPreferencesLower = evaluationPreferences.map(preference => preference.toLowerCase());
      query.leftJoinAndSelect('resource.evaluationPreference', 'evaluationPreference');
      query.andWhere('LOWER(evaluationPreference.name) IN (:...evaluationPreferences)', { evaluationPreferences: evaluationPreferencesLower })
    }
    
    // filter by resource format
    if (formats) {
      const formatsLower = formats.map(format => format.toLowerCase());
      query.leftJoinAndSelect('resource.format', 'format');
      query.andWhere('LOWER(format.name) IN (:...formats)', { formats: formatsLower })
    }
    
    // filter by resource classRoom need
    if (classRoomNeeds) {
      const classRoomNeedsLower = classRoomNeeds.map(classRoomNeed => classRoomNeed.toLowerCase());
      query.leftJoinAndSelect('resource.classRoomNeed', 'classRoomNeed');
      query.andWhere('LOWER(classRoomNeed.name) IN (:...classRoomNeed)', { classRoomNeed: classRoomNeedsLower })
    }
    // filter by resource nlp Standard
    if (nlpStandards) {
      const nlpStandardsLower = nlpStandards.map(standard => standard.toLowerCase());
      query.leftJoinAndSelect('resource.nlpStandard', 'nlpStandard');
      query.andWhere('LOWER(nlpStandard.name) IN (:...nlpStandards)', { nlpStandards: nlpStandardsLower })
    }

    // filter by resource grade level
    if (gradeLevels) {
      const gradeLevelsLower = gradeLevels.map(level => level.toLowerCase());
      query.leftJoinAndSelect('resource.gradeLevel', 'gradeLevel');
      query.andWhere('LOWER(gradeLevel.name) IN (:...gradeLevels)', { gradeLevels: gradeLevelsLower })
    }
    
    // filter by resource subject
    if (subjects) {
      const subjectsLower = subjects.map(subject => subject.toLowerCase());
      query.leftJoinAndSelect('resource.subjectArea', 'subjectArea');
      query.andWhere('LOWER(subjectArea.name) IN (:...subjects)', { subjects: subjectsLower })
    }
    // filter by resource topic
    if (topics) {
      const topicsLower = topics.map(topic => topic.toLowerCase());
      query.leftJoinAndSelect('resource.newsLiteracyTopic', 'topic');
      query.andWhere('LOWER(topic.name) IN (:...topics)', { topics: topicsLower })
    }

    //sorting by ASC or DESC
    if (orderBy) {
      query.orderBy(`resource.${'updatedAt'}`, orderBy as 'ASC' | 'DESC');
    }
    //sorting based on alphabetical order 
    if (alphabetic) {
      query.orderBy('resource.contentTitle', 'ASC');
    } else {
      query.orderBy('resource.contentTitle', 'DESC');
    }
    
    //querying the data with count
    const [resources, totalCount] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
      const totalPages = Math.ceil(totalCount / limit)
    
    //returning the results
      return {
        pagination: {
          totalCount,
          page,
          limit,
          totalPages,
        },
        resources
      }

  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getAssessmentType<T>(resourceId: string): Promise<T[]> {
    const ids =  await this.getRelatedEntities(resourceId , 'assessmentType');
    return await this.assessmentTypeService.findAllByIds<T>(ids)
  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getClassRoomNeed<T>(resourceId: string): Promise<T[]> {
    const ids = await this.getRelatedEntities(resourceId, 'classRoomNeed')
    return await this.classRooomNeedService.findAllByIds<T>(ids)
  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getSubjectArea<T>(resourceId: string): Promise<T[]> {
    const ids =  await this.getRelatedEntities(resourceId ,'subjectArea')
    return await this.subjectAreaService.findAllByIds<T>(ids)
  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getPrerequisite<T>(resourceId: string): Promise<T[]> {
    const ids =  await this.getRelatedEntities(resourceId,'prerequisite')
    return await this.prerequisiteService.findAllByIds<T>(ids)
  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getNlpStandard<T>(resourceId: string): Promise<T[]> {
    const ids =  await this.getRelatedEntities(resourceId ,'nlpStandard')
    return await this.nlpStandardsService.findAllByIds<T>(ids)
  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getResourceType<T>(resourceId: string): Promise<T[]> {
    const ids =  await this.getRelatedEntities(resourceId ,'resourceType')
    return await this.resourceTypeService.findAllByIds<T>(ids)

  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getGradeLevels<T>(resourceId: string): Promise<T[]> {
    const ids =  await this.getRelatedEntities(resourceId,'gradeLevel')
    return await this.gradesService.findAllByIds<T>(ids)
  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getJournalists<T>(resourceId: string): Promise<T[]> {
    const ids =  await this.getRelatedEntities(resourceId ,'journalist')
    return await this.journalistsService.findAllByIds<T>(ids)

  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getLinkToContent<T>(resourceId: string): Promise<T[]> {
    const ids =  await this.getRelatedEntities(resourceId ,'linksToContent')
    return await this.contentLinkService.findAllByIds<T>(ids)

  }

  /**
   * 
   * @param resourceId 
   * @param relationName 
   * @returns 
   */
  async getRelatedEntities(resourceId: string ,  relationName: string): Promise<string[]> {
    const resource = await this.resourcesRepository.findOne({
      where: { id: resourceId },
      relations: [relationName]
    });
    if (!resource) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: 'Resource not found',
      });
    }
    const relatedEntities = resource[relationName];
    if (!relatedEntities || relatedEntities.length === 0) {
      return null;
    }

    const ids = relatedEntities.map((related) => related.id);

  return ids
  }

  /**
   * 
   * @param id 
   */
  async removeResource(id) {
    try {
      await this.resourcesRepository.delete(id)
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 
   * @param  
   */
  async dumpAllRecordsOfAirtable() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let resourcesData = await this.base(this.tableId).select({}).all()
      let Recources = resourcesData.map(record => { return { id: record.id, ...record.fields } })
      const resourceCleanData = removeEmojisFromArray(Recources);
      const resourceMapped = resourceCleanData.map(resource => {
        const nlpStandard:NlpStandardInput[] = [];
        if (resource["NLP standards"] !== undefined) {
          const result = resource["NLP standards"].map((str) => { return str.split(":")});
          result.map( (item , index) => { nlpStandard.push( { name: item[0] , description: item[1].trim()}); })
        }
        const linksToContent:LinksToContentInput[] = [];
        const name1 = resource["Name of link"] ? resource["Name of link"] : ""
        const url1 = resource["Link to content (1)"] ? resource["Link to content (1)"] : ""
        linksToContent.push({ name: name1, url: url1 })
        const name2 = resource["Name of link (2)"] !== undefined ? resource["Name of link (2)"] : ""
        const url2 = resource["Name of link"] !== undefined ? resource["Link to content (2)"] : ""
        linksToContent.push({ name: name2, url: url2 })
        return {
          recordId: resource['id'],
          contentTitle: resource["Content title"] && resource["Content title"].length ? resource["Content title"] : "",
          contentDescription: resource['"About" text'] ? resource['"About" text'] : "",
          linkToDescription: resource["Link to description"]? resource["Link to description"] : "", 
          onlyOnCheckology: resource["Only on Checkology"] &&  resource["Only on Checkology"]  ? true : false, 
          featuredInSift: resource["Featured in the Sift"] &&  resource["Featured in the Sift"] ? true : false, 
          estimatedTimeToComplete: resource[" Estimated time to complete"] ? resource[" Estimated time to complete"] : "", // added a space there intentionally because even if we remove the emoji there is a space there
          journalist: resource["Journalist(s) or SME"] && resource["Journalist(s) or SME"].length ? resource["Journalist(s) or SME"].split(",").map(name => ({ name })) : "",
          linksToContent: linksToContent ,
          resourceType: resource["Resource type (NEW)"] ? resource["Resource type (NEW)"].map(name => ({ name })).filter(item => item !== 'N/A') : "",
          nlnoTopNavigation: resource["NLNO top navigation"] && resource["NLNO top navigation"].length ? resource["NLNO top navigation"].map(name => ({ name })) : "",
          classRoomNeed: resource["Classroom needs"] && resource["Classroom needs"].length ? resource["Classroom needs"].filter(classNeed => classNeed !== 'N/A') : "",
          subjectArea: resource["Subject areas"] && resource["Subject areas"].length ? resource["Subject areas"].map(name => name.trim()) : "",
          nlpStandard: resource["NLP standards"] && resource["NLP standards"].length ? nlpStandard : null,
          newsLiteracyTopic: resource["News literacy topics"] && resource["News literacy topics"].length ? resource["News literacy topics"].filter(nlp => nlp !== 'N/A') : "",
          contentWarning: resource["Content warnings"] && resource["Content warnings"].length ? resource["Content warnings"].filter(content => content !== 'N/A') : "",
          evaluationPreference: resource["Evaluation preference"] && resource["Evaluation preference"].length ? resource["Evaluation preference"].filter(evaluation => evaluation !== 'N/A') : "",
          assessmentType: resource["Assessment types"] && resource["Assessment types"].length ? resource["Assessment types"].filter(item => item !== 'N/A') : "",
          prerequisite: resource["Prerequisites/related"] && resource["Prerequisites/related"].length ? resource["Prerequisites/related"] : "",
          gradeLevel: resource["Grade level/band"] && resource["Grade level/band"].length ? resource["Grade level/band"].filter(grade => grade !== 'N/A') : "",
        };
      });

      const newResources = [];
      for (let resource of resourceMapped) {

        let newResource = await this.resourcesRepository.findOne({
          where: {
            recordId: resource.recordId
          }
        })
        if (!newResource) {
          newResource = this.resourcesRepository.create({
            recordId: resource.recordId,
            contentTitle: resource.contentTitle.trim() != 'N/A'  && resource.contentTitle.trim() != ''  ? resource.contentTitle.trim(): null ,
            contentDescription: resource.contentDescription.trim() !='N/A'  && resource.contentDescription.trim() != '' ? resource.contentDescription.trim() : null,
            estimatedTimeToComplete: resource.estimatedTimeToComplete.trim() != 'N/A' && resource.estimatedTimeToComplete.trim() !='' ? resource.estimatedTimeToComplete.replace(/\.$/, '').trim() : null,
            linkToDescription: resource.linkToDescription.trim() != 'N/A' && resource.linkToDescription.trim() != '' ? resource.linkToDescription: null ,
            onlyOnCheckology: resource.onlyOnCheckology,  
            featuredInSift: resource.featuredInSift,
          })
        }


        newResource.journalist = []
        if (resource.journalist.length) {
          newResource.journalist= await this.journalistsService.findAllByNameOrCreate(resource.journalist)
        }

        newResource.linksToContent = []
        if (resource.linksToContent.length) {
          newResource.linksToContent= await this.contentLinkService.findAllByNameOrCreate(resource.linksToContent)
        }

        newResource.resourceType = []
        if (resource.resourceType) {
          newResource.resourceType = await this.resourceTypeService.findAllByNameOrCreate(resource.resourceType)
        }

        newResource.nlnoTopNavigation = []
        if (resource.nlnoTopNavigation) {
          newResource.nlnoTopNavigation = await this.nlnTopNavigationService.findAllByNameOrCreate(resource.nlnoTopNavigation)
        }

        newResource.gradeLevel = []
        if (resource.gradeLevel) {
          newResource.gradeLevel = await this.gradesService.findAllByNameOrCreate(resource.gradeLevel);
        }

        newResource.subjectArea = []
        if (resource.subjectArea) {
          newResource.subjectArea = await this.subjectAreaService.findAllByNameOrCreate(resource.subjectArea)
        }

        newResource.classRoomNeed = []
        if (resource.classRoomNeed) {
          newResource.classRoomNeed = await this.classRooomNeedService.findAllByNameOrCreate(resource.classRoomNeed)
        }

        newResource.prerequisite = []
        if (resource.prerequisite) {
          newResource.prerequisite = await this.prerequisiteService.findAllByNameOrCreate(resource.prerequisite)
        }
        newResource.nlpStandard = []
        if (resource.nlpStandard) {
          newResource.nlpStandard = await this.nlpStandardsService.findAllByNameOrCreate(resource.nlpStandard)
        }

        newResource.newsLiteracyTopic = []
        if (resource.newsLiteracyTopic) {
          newResource.newsLiteracyTopic = await this.newsLiteracyTopicService.findAllByNameOrCreate(resource.newsLiteracyTopic)
          
        }
        newResource.evaluationPreference = []
        if (resource.evaluationPreference) {
          newResource.evaluationPreference = await this.evaluationPreferenceService.findAllByNameOrCreate(resource.evaluationPreference)
        }

        newResource.contentWarning = []
        if (resource.contentWarning) {
          newResource.contentWarning = await this.contentWarningService.findAllByNameOrCreate(resource.contentWarning)
        }
        newResource.assessmentType = []
        if (resource.assessmentType) {
          newResource.assessmentType = await this.assessmentTypeService.findAllByNameOrCreate(resource.assessmentType)
        }

        newResources.push(newResource);

      }

      const  result = await queryRunner.manager.save(newResources);
      await queryRunner.commitTransaction();
      return result
    }
    catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
    finally {
      await queryRunner.release();
    }

    
  }

}
