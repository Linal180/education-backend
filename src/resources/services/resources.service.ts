import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UtilsService } from "src/util/utils.service";
import { DataSource, Repository } from "typeorm";
import { CreateResourceInput } from "../dto/resource-input.dto";
import ResourceInput, { ResourcesPayload } from "../dto/resource-payload.dto";
import { UpdateResourceInput } from "../dto/update-resource.input";
import { AssessmentType } from "../../AssessmentTypes/entities/assessment-type.entity";
import { ClassRoomNeed } from "../../ClassRoomNeeds/entities/classroom-needs.entity";
import { ContentLink, LinksToContentInput } from "../../ContentLinks/entities/content-link.entity";
import { ContentWarning } from "../../ContentWarnings/entities/content-warning.entity";
import { EvaluationPreference } from "../../EvaluationPreferences/entities/evaluation-preference.entity";
import { Format } from "../entities/format.entity";
import { Grade } from "../../Grade/entities/grade-levels.entity";
import { Journalist } from "../../Journalists/entities/journalist.entity";
import { NewsLiteracyTopic } from "../../newLiteracyTopic/entities/newliteracy-topic.entity";
import { NLNOTopNavigation } from "../../nlnoTopNavigation/entities/nlno-top-navigation.entity";
import { NlpStandard, NlpStandardInput } from "../../nlpStandards/entities/nlp-standard.entity";
import { Prerequisite } from "../../Prerequisite/entities/prerequisite.entity";
import { ResourceType } from "../entities/resource-types.entity";
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

@Injectable()
export class ResourcesService {
    // private airtable: Airtable;
    private base: Base;
    private config: AxiosRequestConfig;
    private readonly tableId: string;
  constructor(
    private readonly dataSource: DataSource,
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
    private readonly configService:ConfigService,


    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    @InjectRepository(ContentLink)
    private contentLinkRepository: Repository<ContentLink>,
    @InjectRepository(Journalist)
    private journalistRepository: Repository<Journalist>,
    @InjectRepository(ResourceType)
    private resourceTypeRepository: Repository<ResourceType>,
    @InjectRepository(NLNOTopNavigation)
    private nlnoTopNavigationRepository: Repository<NLNOTopNavigation>,
    @InjectRepository(Format)
    private formatRepository: Repository<Format>,
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
    @InjectRepository(ClassRoomNeed)
    private classRoomNeedRepository: Repository<ClassRoomNeed>,
    @InjectRepository(SubjectArea)
    private subjectAreaRepository: Repository<SubjectArea>,
    @InjectRepository(NlpStandard)
    private nlpStandardRepository: Repository<NlpStandard>,
    @InjectRepository(NewsLiteracyTopic)
    private newsLiteracyTopicRepository: Repository<NewsLiteracyTopic>,
    @InjectRepository(ContentWarning)
    private contentWarningRepository: Repository<ContentWarning>,
    @InjectRepository(EvaluationPreference)
    private evaluationPreferenceRepository: Repository<EvaluationPreference>,
    @InjectRepository(AssessmentType)
    private assessmentTypeRepository: Repository<AssessmentType>,
    @InjectRepository(Prerequisite)
    private prerequisiteRepository: Repository<Prerequisite>,
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
      newResource.resourceType = await this.getOrCreateEntities(this.resourceTypeRepository, createResourceInput.resourceTypes, ['name']);
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

    resource.resourceType = await this.getOrCreateEntities(this.resourceTypeRepository, updateResourceInput.resourceTypes, ['name', 'url']);
    
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
 * 
 * @param repository 
 * @param entities 
 * @param field 
 * @param save 
 * @returns 
 */
async getOrCreateEntities(repository, entities, fields) {
  const newEntities = [];
  for (const entity of entities) {
    let dbEntity = await repository.findOne({
      where: fields.reduce((acc, field) => {
        acc[field] = field === 'name' ? entity[field].toLowerCase() : entity[field];
        return acc;
      }, {})
    });
    if (!dbEntity) {
      const data = fields.reduce((acc, field) => {
        acc[field] = field === 'name' ? entity[field].toLowerCase() : entity[field];
        return acc;
      }, {});
      dbEntity = repository.create(data);
        await repository.save(dbEntity);
    }
    newEntities.push(dbEntity);
  }
  return newEntities;
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
    const duration = (await this.resourcesRepository.createQueryBuilder("resource")
    .select("DISTINCT resource.estimatedTimeToComplete", "estimatedTimeToComplete")
    .where("resource.estimatedTimeToComplete <> ''") // <-- add this line to avoid having empty values in response
    .getRawMany()).map(resource => resource.estimatedTimeToComplete);
    const journalists = (await this.journalistRepository.createQueryBuilder("journalist")
    .select("DISTINCT journalist.name", "name")
    .getRawMany()).map(journalist => journalist.name);
    const linksToContents = (await this.contentLinkRepository.createQueryBuilder("linksToContent")
    .select("DISTINCT linksToContent.name", "name")
    .getRawMany()).map(linkToContent => linkToContent.name);
    const resourceTypes = (await this.resourceTypeRepository.createQueryBuilder("resourceType")
    .select("DISTINCT resourceType.name", "name")
    .getRawMany()).map(resourceType => resourceType.name);
    const nlnoTopNavigations = (await this.nlnoTopNavigationRepository.createQueryBuilder("nlnoTopNavigation")
    .select("DISTINCT nlnoTopNavigation.name", "name")
    .getRawMany()).map(nlnoTopNavigation => nlnoTopNavigation.name);
    const formats = (await this.formatRepository.createQueryBuilder("format")
    .select("DISTINCT format.name", "name")
    .getRawMany()).map(format => format.name);
    const gradeLevels = (await this.gradeRepository.createQueryBuilder("gradeLevel")
    .select("DISTINCT gradeLevel.name", "name")
    .getRawMany()).map(gradeLevel => gradeLevel.name);
    const classRoomNeeds = (await this.classRoomNeedRepository.createQueryBuilder("classRoomNeed")
    .select("DISTINCT classRoomNeed.name", "name")
    .getRawMany()).map(classRoomNeed => classRoomNeed.name);
    const subjectAreas = (await this.subjectAreaRepository.createQueryBuilder("subjectArea")
    .select("DISTINCT subjectArea.name", "name")
    .getRawMany()).map(subjectArea => subjectArea.name);
    const prerequisites = (await this.prerequisiteRepository.createQueryBuilder("prerequisite")
    .select("DISTINCT prerequisite.name", "name")
    .getRawMany()).map(prerequisite => prerequisite.name);
    const nlpStandards = (await this.nlpStandardRepository.createQueryBuilder("nlpStandard")
    .select("DISTINCT nlpStandard.name", "name")
    .getRawMany()).map(nlpStandard => nlpStandard.name);
    const newsLiteracyTopics = (await this.newsLiteracyTopicRepository.createQueryBuilder("newsLiteracyTopic")
    .select("DISTINCT newsLiteracyTopic.name", "name")
    .getRawMany()).map(newsLiteracyTopic => newsLiteracyTopic.name);
    const evaluationPreferences = (await this.evaluationPreferenceRepository.createQueryBuilder("evaluationPreference")
    .select("DISTINCT evaluationPreference.name", "name")
    .getRawMany()).map(evaluationPreference => evaluationPreference.name);
    const contentWarnings = (await this.contentWarningRepository.createQueryBuilder("contentWarning")
    .select("DISTINCT contentWarning.name", "name")
    .getRawMany()).map(contentWarning => contentWarning.name);
    const assessmentTypes = (await this.assessmentTypeRepository.createQueryBuilder("assessmentType")
    .select("DISTINCT assessmentType.name", "name")
    .getRawMany()).map(assessmentType => assessmentType.name);

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
  const query = this.resourcesRepository.createQueryBuilder('resource');
    
  // filter by most relevant
  if (mostRelevant && searchString) {
    const searchStringLower = searchString.toLowerCase();
    query.andWhere(`to_tsvector('english', LOWER(resource.contentTitle)) @@ plainto_tsquery('english', LOWER(:searchString))`, { searchString: searchStringLower })
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
async getAssessmentType(resourceId: string): Promise<AssessmentType[]> {
  return await this.getRelatedEntities(resourceId,this.resourcesRepository, this.assessmentTypeRepository ,'assessmentType')
}
/**
 * 
 * @param resourceId 
 * @returns 
 */
async getClassRoomNeed(resourceId: string): Promise<ClassRoomNeed[]> {
  return await this.getRelatedEntities(resourceId,this.resourcesRepository, this.classRoomNeedRepository ,'classRoomNeed')
}

/**
 * 
 * @param resourceId 
 * @returns 
 */
 async getSubjectArea(resourceId: string): Promise<SubjectArea[]> {
  return await this.getRelatedEntities(resourceId,this.resourcesRepository, this.subjectAreaRepository ,'subjectArea')
}
/**
 * 
 * @param resourceId 
 * @returns 
 */
async getPrerequisite(resourceId: string): Promise<Prerequisite[]> {
  return await this.getRelatedEntities(resourceId,this.resourcesRepository, this.prerequisiteRepository ,'prerequisite')
}
/**
 * 
 * @param resourceId 
 * @returns 
 */
async getNlpStandard(resourceId: string): Promise<NlpStandard[]> {
  return await this.getRelatedEntities(resourceId,this.resourcesRepository, this.nlpStandardRepository ,'nlpStandard')
}
/**
 * 
 * @param resourceId 
 * @returns 
 */
async getResourceType(resourceId: string): Promise<ResourceType[]> {
  return await this.getRelatedEntities(resourceId,this.resourcesRepository, this.resourceTypeRepository ,'resourceType')
}
/**
 * 
 * @param resourceId 
 * @returns 
 */
async getGradeLevels(resourceId: string): Promise<Grade[]> {
  return await this.getRelatedEntities(resourceId,this.resourcesRepository, this.gradeRepository ,'gradeLevel')
}
/**
 * 
 * @param resourceId 
 * @returns 
 */
async getJournalists(resourceId: string): Promise<Journalist[]> {
  return await this.getRelatedEntities(resourceId,this.resourcesRepository, this.journalistRepository ,'journalist')
}
/**
 * 
 * @param resourceId 
 * @returns 
 */
async getLinkToContent(resourceId: string): Promise<ContentLink[]> {
  return await this.getRelatedEntities(resourceId, this.resourcesRepository, this.contentLinkRepository ,'linksToContent')
}
/**
 * 
 * @param resourceId 
 * @param resourceRepo 
 * @param entityRepo 
 * @param relationName 
 * @returns 
 */
async getRelatedEntities<T>(resourceId: string, resourceRepo: Repository<Resource>, entityRepo: Repository<T>,relationName: string): Promise<T[]> {
  const resource = await resourceRepo.findOne({
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
    return null
  }
  const data = await entityRepo.createQueryBuilder()
    .where((qb) => {
      qb.whereInIds(relatedEntities.map((related) => related.id));
    })
    .getMany();
    return data;
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

      // newResource.resourceType = []
      // if (resource.resourceType) {
      //   const result = await this.checkRecordExistOrAddInEntity(this.resourceTypeRepository,  resource.recordId, resource.resourceType, ['name'])
      //   newResource.resourceType = [...result];
      // }

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
        // await this.checkRecordExistOrAddInEntity(this.assessmentTypeRepository,  resource.recordId, resource.assessmentType, ['name'])
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

async checkRecordExistOrAddInEntity(repository: any, recordId: string, data: any, fields = []) {

  if (Array.isArray(data)) {
    // If data is an array, iterate over each item and check/add records
    const typeOfData = this.checkArrayType(data)
    const newEntities = []

    for (const item of data) {
      //array of strings
      if (  typeof item === 'string' && typeOfData === 3 ) {
        let dbEntity = await repository.findOne({
          where: fields.reduce((acc, field) => {
            acc[field] = field === 'name' ? item : item;
            return acc;
          }, {})
        });
        if(!dbEntity){
          const data = fields.reduce((acc, field) => {
            acc[field] = field === 'name' ? item : item;
            return acc;
          }, {});
          dbEntity = await repository.create({ ...data, recordId });
          await repository.save(dbEntity);
          
        }
        newEntities.push(dbEntity)
      }
      //array of Objects
      if ( (Object.keys(item).length > 0)  && typeOfData === 2) {
        if(item.name){
          let dbEntity = await repository.findOne({
            where: fields.reduce((acc, field) => {
              acc[field] = field === 'name' ? item[field] : item[field];
              return acc;
            }, {})
          });
          if(!dbEntity){
            const data = fields.reduce((acc, field) => {
              acc[field] = field === 'name' ? item[field] : item[field];
              return acc;
            }, {});

            dbEntity = await repository.create({...data, recordId })
            await repository.save(dbEntity);
          }
          newEntities.push(dbEntity)
        }
      } 
    }
    return newEntities
  } 
  else if (typeof data === 'string') {
    let dbEntity = await repository.findOne({ where: { name: data ,  recordId: recordId } });
    if (!dbEntity) {
      const document = fields.reduce((acc, field) => {
        acc[field] = field === 'name' ? data : data;
        return acc;
      }, {});
      dbEntity = await repository.create({ ...document, recordId });
      await repository.save(dbEntity);
    } 
    return [dbEntity]
  } else {
    console.log('Invalid data format provided.');
  }
}

checkArrayType(arr) {
  let isArrayOfObjects = false;
  let isArrayOfStrings = false;

  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'object') {
      isArrayOfObjects = true;
    } else if (typeof arr[i] === 'string') {
      isArrayOfStrings = true;
    }
  }

  if (isArrayOfObjects && isArrayOfStrings) {
    // The array contains both objects and strings.
    return 1;
  } else if (isArrayOfObjects) {
    // The array contains only objects.
    return 2;
  } else if (isArrayOfStrings) {
    // The array contains only strings.
    return 3;
  } else {
    // The array is empty or does not contain objects or strings.
    return 0;
  }
}

}
