import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UtilsService } from "../../util/utils.service";
import { DataSource, Repository, In, Not } from "typeorm";
import { CreateResourceInput } from "../dto/resource-input.dto";
import { Cron, CronExpression } from '@nestjs/schedule';
import ResourceInput, { ResourcesPayload } from "../dto/resource-payload.dto";
import { UpdateResourceInput } from "../dto/update-resource.input";
import { AssessmentType } from "../../assessmentTypes/entities/assessment-type.entity";
import { ClassRoomNeed } from "../../classRoomNeeds/entities/classroom-needs.entity";
import { ContentLink, } from "../../contentLinks/entities/content-link.entity";
import { LinksToContentInput } from "../../contentLinks/dto/links-to-content.input.dto"
import { Grade } from "../../grade/entities/grade-levels.entity";
import { Journalist } from "../../journalists/entities/journalist.entity";
import { NlpStandard } from "../../nlpStandards/entities/nlp-standard.entity";
import { Prerequisite } from "../../prerequisite/entities/prerequisite.entity";
import { ResourceType } from "../../resourceType/entities/resource-types.entity";
import { Resource } from "../entities/resource.entity";
import { SubjectArea } from "../../subjectArea/entities/subject-areas.entity";
import { ContentLinkService } from "../../contentLinks/content-link.service";
import { JournalistsService } from "../../journalists/journalists.service";
import { NLNOTopNavigationService } from "../../nlnoTopNavigation/nlno-top-navigation.service";
import { GradesService } from "../../grade/grades.service";
import { ClassRoomNeedService } from "../../classRoomNeeds/classroom-need.service";
import { SubjectAreaService } from "../../subjectArea/subjectArea.service";
import { PrerequisiteService } from "../../prerequisite/prerequisite.service";
import { NlpStandardService } from "../../nlpStandards/nlp-standard.service";
import { NewsLiteracyTopicService } from "../../newLiteracyTopic/newsliteracy-topic.service";
import { EvaluationPreferenceService } from "../../evaluationPreferences/evaluation-preference.service";
import { ContentWarningService } from "../../contentWarnings/content-warning.service";
import { AssessmentTypeService } from "../../assessmentTypes/assessment-type.service";
import { removeEmojisFromArray } from "../../lib/helper";
import Airtable, { Base } from "airtable";
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { ResourceTypeService } from "../../resourceType/resource-type.service";
import { FormatService } from "../../format/format.service";
import { NlpStandardInput } from "../../nlpStandards/dto/nlp-standard.input.dto";
import { MediaOutletsFeaturedService } from "../../mediaOutletFeatured/media-outlet-featured.service";
import { MediaOutletsMentionedService } from "../../mediaOutletMentioned/media-outlet-mentioned.service";
import { WordWallTermsService } from "../../wordWallTerms/word-wall-terms.service";
import { WordWallTermLinksService } from "../../wordWallTermLinks/word-wall-term-link.services";
import { EssentialQuestionsService } from "../../essentialQuestions/essential-questions.service";
import { CronServices } from "../../cron/cron.services";
import { NotifyPayload } from "../../util/interfaces";
import { resourceOperations } from "../../util/interfaces";
import { AirtablePayload } from "../../util/interfaces";
import { RawResource } from "../../util/interfaces";
import { UpdateCleanPayload } from "../../util/interfaces"

@Injectable()
export class ResourcesService {
  // private airtable: Airtable;
  private base: Base;
  private config: AxiosRequestConfig;
  private readonly tableId: string;
  private educatorBaseId: Base;
  private readonly educatorTableId: string;
  private readonly checkNewRecordsWebHookId: string;
  private readonly updateRecordsWebHookId: string;
  private readonly deletedRecordsWebHookId: string;
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    private readonly contentLinkService: ContentLinkService,
    private readonly journalistsService: JournalistsService,
    private readonly nlnTopNavigationService: NLNOTopNavigationService,
    private readonly gradesService: GradesService,
    private readonly classRooomNeedService: ClassRoomNeedService,
    private readonly subjectAreaService: SubjectAreaService,
    private readonly prerequisiteService: PrerequisiteService,
    private readonly nlpStandardsService: NlpStandardService,
    private readonly newsLiteracyTopicService: NewsLiteracyTopicService,
    private readonly contentWarningService: ContentWarningService,
    private readonly evaluationPreferenceService: EvaluationPreferenceService,
    private readonly assessmentTypeService: AssessmentTypeService,
    private readonly resourceTypeService: ResourceTypeService,
    private readonly mediaOutletsFeaturedService: MediaOutletsFeaturedService,
    private readonly mediaOutletsMentionedService: MediaOutletsMentionedService,
    private readonly wordWallTermsService: WordWallTermsService,
    private readonly wordWallTermLinksService: WordWallTermLinksService,
    private readonly essentialQuestionsService: EssentialQuestionsService,
    private readonly configService: ConfigService,
    private readonly cronServices: CronServices,
    private readonly formatService: FormatService,
    private utilsService: UtilsService
  ) {
    const airtable = new Airtable({ apiKey: this.configService.get<string>('personalToken') });
    this.base = airtable.base(this.configService.get<string>('baseId'));
    this.tableId = this.configService.get<string>('tableId');
    this.educatorBaseId = airtable.base(this.configService.get<string>('educatorBaseId'));
    this.educatorTableId = this.configService.get<string>('educatorTableId');

    //webhookIds
    this.checkNewRecordsWebHookId = `${this.configService.get<string>('addWebHookId')}`;
    this.updateRecordsWebHookId = `${this.configService.get<string>('updateWebHookId')}`
    this.deletedRecordsWebHookId = `${this.configService.get<string>('removeWebHookId')}`;

    const headers = { Authorization: `Bearer ${this.configService.get<string>('personalToken')}`, };
    const config: AxiosRequestConfig = { headers }
    this.config = config

  }


  /**
   * 
   * @param createResourceInput 
   * @returns 
   */
  async create(createResourceInput: CreateResourceInput): Promise<Resource> {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newResource = this.resourcesRepository.create(createResourceInput);
      newResource.journalist = await this.journalistsService.findByNameOrCreate(createResourceInput.journalists);
      newResource.linksToContent = await this.contentLinkService.findAllByNameOrCreate(createResourceInput.linksToContents)
      newResource.resourceType = await this.resourceTypeService.findAllByNameOrCreate(createResourceInput.resourceTypes)
      newResource.nlnoTopNavigation = await this.nlnTopNavigationService.findAllByNameOrCreate(createResourceInput.nlnoTopNavigations)
      newResource.gradeLevel = await this.gradesService.findAllByNameOrCreate(createResourceInput.gradeLevels)
      newResource.classRoomNeed = await this.classRooomNeedService.findAllByNameOrCreate(createResourceInput.classRoomNeeds)
      newResource.subjectArea = await this.subjectAreaService.findAllByNameOrCreate(createResourceInput.subjectAreas)
      // newResource.prerequisite = await this.prerequisiteService.findAllByNameOrCreate(createResourceInput.prerequisites) //prerequisite['Content title'] 
      newResource.nlpStandard = await this.nlpStandardsService.findAllByNameOrCreate(createResourceInput.nlpStandards)
      newResource.newsLiteracyTopic = await this.newsLiteracyTopicService.findAllByNameOrCreate(createResourceInput.newsLiteracyTopics)
      newResource.evaluationPreference = await this.evaluationPreferenceService.findAllByNameOrCreate(createResourceInput.evaluationPreferences)
      newResource.contentWarning = await this.contentWarningService.findAllByNameOrCreate(createResourceInput.contentWarnings)
      newResource.assessmentType = await this.assessmentTypeService.findByNameOrCreate(createResourceInput.assessmentTypes)

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
      const { id } = updateResourceInput;
      const resource = await this.resourcesRepository.findOne({ where: { id } });

      if (!resource) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: `Resource with id: ${updateResourceInput.id} not found`,
        });
      }
      this.resourcesRepository.merge(resource, updateResourceInput);
      resource.journalist = await this.journalistsService.findByNameOrCreate(updateResourceInput.journalists)
      resource.linksToContent = await this.contentLinkService.findAllByNameOrCreate(updateResourceInput.linksToContents)
      resource.resourceType = await this.resourceTypeService.findAllByNameOrCreate(updateResourceInput.resourceTypes)
      resource.nlnoTopNavigation = await this.nlnTopNavigationService.findAllByNameOrCreate(updateResourceInput.nlnoTopNavigations)
      resource.gradeLevel = await this.gradesService.findAllByNameOrCreate(updateResourceInput.gradeLevels)
      resource.classRoomNeed = await this.classRooomNeedService.findAllByNameOrCreate(updateResourceInput.classRoomNeeds)
      resource.subjectArea = await this.subjectAreaService.findAllByNameOrCreate(updateResourceInput.subjectAreas)
      // resource.prerequisite = await this.prerequisiteService.findAllByNameOrCreate(updateResourceInput.prerequisites) c
      resource.nlpStandard = await this.nlpStandardsService.findAllByNameOrCreate(updateResourceInput.nlpStandards)
      resource.newsLiteracyTopic = await this.newsLiteracyTopicService.findAllByNameOrCreate(updateResourceInput.newsLiteracyTopics)
      resource.evaluationPreference = await this.evaluationPreferenceService.findAllByNameOrCreate(updateResourceInput.evaluationPreferences)
      resource.contentWarning = await this.contentWarningService.findAllByNameOrCreate(updateResourceInput.contentWarnings)
      resource.assessmentType = await this.assessmentTypeService.findByNameOrCreate(updateResourceInput.assessmentTypes)


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
      const duration = Array.from(new Set(resources.map(resource => resource.estimatedTimeToComplete)));
      const journalists = await this.journalistsService.findAllByName()
      const linksToContents = await this.contentLinkService.findAllByName()
      const resourceTypes = await this.resourceTypeService.findAllByName()
      const nlnoTopNavigations = await this.nlnTopNavigationService.findAllByName()
      const formats = await this.formatService.findAllDistinctByName()
      const gradeLevels = await this.gradesService.findAllByName()
      const classRoomNeeds = await this.classRooomNeedService.findAllByName()
      const subjectAreas = await this.subjectAreaService.findAllByName()
      const prerequisites = await this.prerequisiteService.findAllByName()
      const nlpStandards = await this.nlpStandardsService.getNlpStandardByFields(['name', 'description'])

      const newsLiteracyTopics = await this.newsLiteracyTopicService.findAllByName()
      const evaluationPreferences = await this.evaluationPreferenceService.findAllByName()
      const contentWarnings = await this.contentWarningService.findAllByName()
      const assessmentTypes = await this.assessmentTypeService.findAllByName()

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
        nlpStandards: nlpStandards ? this.utilsService.convertArrayOfObjectsToArrayOfString(nlpStandards, ['name', 'description']) : [],
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
    const { limit, page } = resourceInput.paginationOptions
    const { searchString, orderBy, alphabetic, mostRelevant, estimatedTimeToComplete, resourceTypes, evaluationPreferences, formats, classRoomNeeds, nlpStandards, gradeLevels, subjects, topics } = resourceInput

    // const query = this.resourcesRepository
    const query = this.resourcesRepository.createQueryBuilder('resource');

    // filter by most relevant
    if (mostRelevant && searchString) {

      const searchStringLower = searchString.toLowerCase().trim();
      const searchWords = searchStringLower.split(" ");
      const tsVector = `to_tsvector('english', LOWER(resource.contentTitle))`;

      // Create separate WHERE conditions for each word with OR between them
      query.andWhere(searchWords.map((word, index) => {
        const paramKey = `searchWord${index}`;
        query.setParameter(paramKey, `%${word}%`);
        return `LOWER(resource.contentTitle) LIKE LOWER(:${paramKey})`;
      }).join(' OR '));

      query.andWhere(searchWords.map((word, index) => {
        const paramKey = `searchWord${index}`;
        return `to_tsvector('english', LOWER(resource.contentTitle)) @@ plainto_tsquery('english', LOWER(:${paramKey}))`;
      }).join(' OR '));

      searchWords.forEach((word, index) => {
        const paramKey = `searchWord${index}`;
        query.setParameter(paramKey, `%${word}%`);
      });

      query.addSelect(`ts_rank(${tsVector}, plainto_tsquery('english', LOWER(:searchStringLower)))`, 'rank')
        .setParameter('searchStringLower', searchStringLower);

      query.orderBy('rank', 'DESC');
    }
    //search based on title of content 
    else if (searchString) {
      const searchStringLowerCase = searchString.toLowerCase().trim();
      const searchWords = searchStringLowerCase.split(" ");
      // simple Query
      searchWords.forEach((word, index) => {
        query.orWhere("resource.contentTitle ILIKE :searchWord", { searchWord: `%${word}%` });
      });
    }

    // filter by resource estimated time to complete
    if (estimatedTimeToComplete) {
      const estimatedTimeToCompleteLower = estimatedTimeToComplete.toLowerCase().trim();
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
    try {
      const ids = await this.getRelatedEntities(resourceId, 'assessmentType');
      return await this.assessmentTypeService.findAllByIds(ids);
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }

  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getClassRoomNeed(resourceId: string): Promise<ClassRoomNeed[]> {
    try {
      const ids = await this.getRelatedEntities(resourceId, 'classRoomNeed')
      return await this.classRooomNeedService.findAllByIds(ids)
    }
    catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getSubjectArea(resourceId: string): Promise<SubjectArea[]> {
    try {
      const ids = await this.getRelatedEntities(resourceId, 'subjectArea')
      return await this.subjectAreaService.findAllByIds(ids);
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getPrerequisite(resourceId: string): Promise<Prerequisite[]> {
    try {
      const ids = await this.getRelatedEntities(resourceId, 'prerequisite')
      if (ids) {
        return await this.prerequisiteService.findAllByIds(ids);
      }
      return [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getNlpStandard(resourceId: string): Promise<NlpStandard[]> {
    try {
      const ids = await this.getRelatedEntities(resourceId, 'nlpStandard')
      return await this.nlpStandardsService.findAllByIds(ids);
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }

  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getResourceType(resourceId: string): Promise<ResourceType[]> {
    try {
      const ids = await this.getRelatedEntities(resourceId, 'resourceType')
      return await this.resourceTypeService.findAllByIds(ids);
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getGradeLevels(resourceId: string): Promise<Grade[]> {
    try {
      const ids = await this.getRelatedEntities(resourceId, 'gradeLevel')
      return await this.gradesService.findAllByIds(ids)
    }
    catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getJournalists(resourceId: string): Promise<Journalist[]> {
    try {
      const ids = await this.getRelatedEntities(resourceId, 'journalist')
      return await this.journalistsService.findAllByIds(ids);
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }


  }

  /**
   * 
   * @param resourceId 
   * @returns 
   */
  async getLinkToContent(resourceId: string): Promise<ContentLink[]> {
    try {
      const ids = await this.getRelatedEntities(resourceId, 'linksToContent')
      return await this.contentLinkService.findAllByIds(ids)
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }


  }

  /**
   * 
   * @param resourceId 
   * @param relationName 
   * @returns 
   */
  async getRelatedEntities(resourceId: string, relationName: string): Promise<string[]> {
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
  async removeResource(id: string): Promise<void> {
    try {
      await this.resourcesRepository.delete(id)
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 
   * @param  null
   * @returns null
   */
  async dumpAllRecordsOfAirtable(): Promise<Array<Resource> | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let resourcesData = await this.educatorBaseId(this.educatorTableId).select({}).all()
      let Recources = resourcesData.map(record => { return { id: record.id, ...record.fields } })
      const resourceMapped = await this.cleanResources(Recources);
      const newResources = [];
      for (let resource of resourceMapped) {
        const newResource = await this.createResource(resource)
        newResources.push(newResource)
      }
      const result = await queryRunner.manager.save(newResources);
      await queryRunner.commitTransaction();
      return result
    }
    catch (error) {
      await queryRunner.rollbackTransaction();
      console.log("dummpAllRecords Error:    -->   ", error);
      throw error;
    }
    finally {
      await queryRunner.release();
    }
  }

  async getResourceRecord(baseTableName: string, resourceId: string): Promise<any | null> {
    // Fetch the resource from the 'resources' table
    try {
      const resourceRecord = await this.educatorBaseId(baseTableName).find(resourceId);
      return resourceRecord
    }
    catch (error) {
      console.log("Resource Record not fetch: ", error)
      return null
    }
  }

  async associateResourceRecords(linkedTableIds: string[], linkedTableName: string, returnFields: string[],) {
    try {
      let linkedTableData = null;
      if (linkedTableIds && Array.isArray(linkedTableIds)) {
        linkedTableData = await this.educatorBaseId(linkedTableName) // Adjust table name as per your schema
          .select({
            fields: [...returnFields],
            filterByFormula: `OR(${linkedTableIds.map((id) => `RECORD_ID()='${id}'`).join(',')})`,
          })
          .all();
      }

      if (!linkedTableData) {
        console.log("Resource not found")
        return null; // Resource not found
      }

      return linkedTableData && linkedTableData.map(item => { return { ...item.fields } }) || []
    } catch (error) {
      // Handle error
      console.log("Resource not found", error)
      return null;
    }
  }

  async cleanResources(recources: Array<RawResource>) {
    const resourceCleanData = removeEmojisFromArray(recources);
    return await Promise.all(
      resourceCleanData.map(async resource => {
        const nlpStandard: NlpStandardInput[] = [];
        if (resource["NLP standards"] !== undefined) {
          const result = resource["NLP standards"].map((str) => { return str.split(":") });
          result.map((item, index) => { nlpStandard.push({ name: item[0], description: item[1].trim() }); })
        }
        const linksToContent: LinksToContentInput[] = [];
        const name1 = resource["Name of link"] ? resource["Name of link"] : ""
        const url1 = resource["Link to content (1)"] ? resource["Link to content (1)"] : ""
        linksToContent.push({ name: name1, url: url1 })
        const name2 = resource["Name of link (2)"] !== undefined ? resource["Name of link (2)"] : ""
        const url2 = resource["Name of link"] !== undefined ? resource["Link to content (2)"] : ""
        linksToContent.push({ name: name2, url: url2 })
        const resourceRecord = await this.getResourceRecord('NLP content inventory', resource['id'])

        let journalists = [];
        if (Array.isArray(resource["Journalist(s) or SME"]) && resource["Journalist(s) or SME"].length) {
          const journalistRecordIds = resourceRecord.get("Journalist(s) or SME") || [];
          journalists = await this.associateResourceRecords(journalistRecordIds, 'SMEs', ['Name', 'Organization'])
        }

        let wordWallTerms = [];
        if (Array.isArray(resource["Word wall terms"]) && resource["Word wall terms"].length) {
          const wordWallTermRecordIds = resourceRecord.get("Word wall terms") || [];
          wordWallTerms = await this.associateResourceRecords(wordWallTermRecordIds, 'Vocabulary terms', ['Term'])
        }

        let wordWallTermLinks = [];
        if (Array.isArray(resource["Word wall terms to link"]) && resource["Word wall terms to link"].length) {
          const wordWallTermLinksRecordIds = resourceRecord.get("Word wall terms to link") || [];
          wordWallTermLinks = await this.associateResourceRecords(wordWallTermLinksRecordIds, 'Vocabulary terms', ['Term'])
        }

        let essentialQuestions = [];
        if (Array.isArray(resource["Learning objectives and essential questions"]) && resource["Learning objectives and essential questions"].length) {
          const essentialQuestionRecordIds = resourceRecord.get("Learning objectives and essential questions") || [];
          essentialQuestions = await this.associateResourceRecords(essentialQuestionRecordIds, 'Learning objectives and essential questions', ['Title'])
        }

        // Is not used at the moment
        // let preRequisties = []
        // if (Array.isArray(resource["Prerequisites/related"]) && resource["Prerequisites/related"].length) {
        //   const preRequisitiesRecordIds = resourceRecord.get("Prerequisites/related") || [];
        //   preRequisties = await this.associateResourceRecords(preRequisitiesRecordIds, 'NLP content inventory', ["Content title"])
        //   console.log("preRequisties: ----------------------   ", preRequisties)
        // }

        return {
          recordId: resource['id'],
          resourceId: resource["Resource ID"],
          primaryImage: resource["NEW: Primary image S3 link"] || null,
          thumbnailImage: resource["NEW: Thumbnail image S3 link"] || null,
          checkologyPoints: resource['Checkology points'],
          averageCompletedTime: resource["Average completion times"] ? String(resource["Average completion times"]) : null,
          shouldGoToDormant: resource["Why should it go dormant?"] ? resource["Why should it go dormant?"] : null,
          status: resource["Status"] ? resource["Status"] : null,
          imageGroup: resource["Image group"] ? resource["Image group"] : null,
          imageStatus: resource["Image status"] ? resource["Image status"] : null,
          auditStatus: resource["Audit status"] ? resource["Audit status"] : null,
          auditLink: resource["Link to audit"] ? resource["Link to audit"] : null,
          userFeedBack: resource["User feedback"] ? resource["User feedback"] : null,
          linkToTranscript: resource["Link to transcript"] ? resource["Link to transcript"] : null,
          contentTitle: resource["Content title"] && resource["Content title"].length ? resource["Content title"] : "",
          contentDescription: resource['"About" text'] ? resource['"About" text'] : "",
          linkToDescription: resource["Link to description"] ? resource["Link to description"] : "",
          onlyOnCheckology: resource["Only on Checkology"] && resource["Only on Checkology"] ? true : false,
          featuredInSift: resource["Featured in the Sift"] && resource["Featured in the Sift"] ? true : false,
          estimatedTimeToComplete: resource[" Estimated time to complete"] ? resource[" Estimated time to complete"] : "", // added a space there intentionally because even if we remove the emoji there is a space there
          journalist: journalists,
          formats: resource["Format(s)"] && resource["Format(s)"].length ? resource["Format(s)"] : [],
          linksToContent: linksToContent,
          resourceType: resource["Resource type (recent old)"] && resource["Resource type (recent old)"].length ? resource["Resource type (recent old)"].map(name => ({ name })).filter(item => item !== 'N/A') : "",
          nlnoTopNavigation: resource["NLNO top navigation"] && resource["NLNO top navigation"].length ? resource["NLNO top navigation"].map(name => ({ name })) : "",
          classRoomNeed: resource["Classroom needs"] && resource["Classroom needs"].length ? resource["Classroom needs"].filter(classNeed => classNeed !== 'N/A') : "",
          subjectArea: resource["Subject areas"] && resource["Subject areas"].length ? resource["Subject areas"].map(name => name.trim()) : "",
          nlpStandard: resource["NLP standards"] && resource["NLP standards"].length ? nlpStandard : null,
          newsLiteracyTopic: resource["News literacy topics"] && resource["News literacy topics"].length ? resource["News literacy topics"].filter(nlp => nlp !== 'N/A') : "",
          contentWarning: resource["Content warnings"] && resource["Content warnings"].length ? resource["Content warnings"].filter(content => content !== 'N/A') : "",
          evaluationPreference: resource["Evaluation preference"] && resource["Evaluation preference"].length ? resource["Evaluation preference"].filter(evaluation => evaluation !== 'N/A') : "",
          assessmentType: resource["Assessment types"] && resource["Assessment types"].length ? resource["Assessment types"].filter(item => item !== 'N/A') : "",
          // prerequisite: preRequisties ? preRequisties : [],
          //resource["Prerequisites/related"] && resource["Prerequisites/related"].length ? resource["Prerequisites/related"] : "",
          gradeLevel: resource["Grade level/band"] && resource["Grade level/band"].length ? resource["Grade level/band"].filter(grade => grade !== 'N/A') : "",
          wordWallTerms: wordWallTerms ? wordWallTerms : [],
          wordWallTermLinks: wordWallTermLinks,
          mediaOutletsFeatured: resource[" Media outlets featured"] && resource[" Media outlets featured"].length ? resource[" Media outlets featured"].map(name => ({ name: name.trim() })) : "",
          mediaOutletsMentioned: resource[" Media outlets mentioned"] && resource[" Media outlets mentioned"].length ? resource[" Media outlets mentioned"].map(name => ({ name })) : "",
          essentialQuestions: essentialQuestions,
        };
      })
    )
  }

  private async assignFieldIfExists<T, K extends keyof T>(
    payload: T,
    resource: RawResource,
    field: string,
    propertyName: K extends keyof T ? string : never,
    service?: any,
    isArrayField: boolean = false
  ): Promise<void> {
    if (field in resource) {
      if (isArrayField) {
        const value = resource[field];
        (payload as any)[propertyName] = value && value.length
          ? await service.findByNameOrCreate(value)
          : [];
      } else {
        const value = resource[field];
        (payload as any)[propertyName] = value;
      }
    }
  }

  private async assignArrayFieldIfExists<T, K extends keyof T>(
    payload: T,
    resource: Record<string, any>,
    field: string,
    propertyName: K,
    mapperFn?: (value: string) => any,
    filterFn?: (item: any) => boolean,
    service?: any
  ): Promise<void> {
    if (field in resource) {
      const values = resource[field].map((item: any) => {
        if (typeof item === 'string') {
          const trimmedItem = item.trim();
          if (service) {
            return service.findByNameOrCreate(trimmedItem);
          } else if (mapperFn) {
            return mapperFn(trimmedItem);
          } else {
            return { name: trimmedItem };
          }
        }
        return null;
      }).filter((item: any) => item !== null);

      payload[propertyName] = filterFn ? values.filter(filterFn) : values;
    }
  }

  async updatecleanResources(resources: RawResource[]): Promise<AirtablePayload[]> {
    try {
      const resourceCleanData = removeEmojisFromArray(resources);

      return await Promise.all(
        resourceCleanData.map(async (resource: RawResource) => {
          const updatedPayload: UpdateCleanPayload = {};

          this.assignFieldIfExists(updatedPayload, resource, "Checkology points", "checkologyPoints");
          this.assignFieldIfExists(updatedPayload, resource, "Average completion times", "averageCompletedTime");
          this.assignFieldIfExists(updatedPayload, resource, "Why should it go dormant?", "shouldGoToDormant");
          this.assignFieldIfExists(updatedPayload, resource, "Status", "status");
          this.assignFieldIfExists(updatedPayload, resource, "Image group", "imageGroup");
          this.assignFieldIfExists(updatedPayload, resource, "Image status", "imageStatus");
          this.assignFieldIfExists(updatedPayload, resource, "Audit status", "auditStatus");
          this.assignFieldIfExists(updatedPayload, resource, "Link to audit", "auditLink");
          this.assignFieldIfExists(updatedPayload, resource, "User feedback", "userFeedBack");
          this.assignFieldIfExists(updatedPayload, resource, "Link to transcript", "linkToTranscript");
          this.assignFieldIfExists(updatedPayload, resource, "Content title", "contentTitle");
          this.assignFieldIfExists(updatedPayload, resource, '"About" text', "contentDescription");

          this.assignFieldIfExists(updatedPayload, resource, "NEW: Primary image S3 link", "primaryImage");
          // this.assignFieldIfExists(updatedPayload, resource, 'NEW: Thumbnail image S3 link', "thumbnailImage");

          this.assignFieldIfExists(updatedPayload, resource, "Link to description", "linkToDescription");
          this.assignFieldIfExists(updatedPayload, resource, "Only on Checkology", "onlyOnCheckology", true);
          this.assignFieldIfExists(updatedPayload, resource, "Featured in the Sift", "featuredInSift", true);
          this.assignFieldIfExists(updatedPayload, resource, " Estimated time to complete", "estimatedTimeToComplete");

          // this.assignFieldIfExists(updatedPayload, resource, "Prerequisites/related", "prerequisite");

          //realtionship fields
          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Resource type (USE THIS)", "resourceType", name => ({ name }), item => item.name !== 'N/A');
          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "NLNO top navigation", "nlnoTopNavigation", name => ({ name }));
          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Classroom needs", "classRoomNeed", name => ({ name }), item => item.name !== 'N/A');
          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Subject areas", "subjectArea", name => ({ name: name.trim() }));
          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "News literacy topics", "newsLiteracyTopic", name => ({ name: name.trim() }), item => item.name !== 'N/A');
          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Content warnings", "contentWarning", name => ({ name: name.trim() }), item => item.name !== 'N/A');
          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Evaluation preference", "evaluationPreference", name => ({ name: name.trim() }), item => item.name !== 'N/A');
          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Assessment types", "assessmentType", name => ({ name: name.trim() }), item => item.name !== 'N/A');
          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Grade level/band", "gradeLevel", name => ({ name: name.trim() }), item => item.name !== 'N/A');

          // this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Word wall terms", "wordWallTerms", name => ({ name: name.trim() })); //these keys are [ "rec***" , ....]
          // this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Word wall terms to link", "wordWallTermLinks", name => ({ name: name.trim() })); //these keys are [ "rec***" , ....]
          // this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Learning objectives and essential questions", "essentialQuestions", name => ({ name: name.replace(/[^a-zA-Z0-9 ?,.!]+/g, '').trim() })); //these keys are [ "rec***" , ....]

          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, " Media outlets featured", "mediaOutletsFeatured", name => ({ name: name.trim() }));
          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, " Media outlets mentioned", "mediaOutletsMentioned", name => ({ name }));
          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "NLP standards", "nlpStandard", (str) => {
            const [name, description] = str.split(":");
            return { name, description: description.trim() };
          });
          this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Format(s)", "formats", name => ({ name }));

          // Journalist
          const resourceRecord = await this.getResourceRecord('NLP content inventory', resource['id'])

          let journalists = [];
          if (Array.isArray(resource["Journalist(s) or SME"]) && resource["Journalist(s) or SME"].length) {
            const journalistRecordIds = resourceRecord.get("Journalist(s) or SME") || [];
            journalists = await this.associateResourceRecords(journalistRecordIds, 'SMEs', ['Name', 'Organization'])
          }
          //WordWallTerm
          let wordWallTerms = [];
          if (Array.isArray(resource["Word wall terms"]) && resource["Word wall terms"].length) {
            const wordWallTermRecordIds = resourceRecord.get("Word wall terms") || [];
            wordWallTerms = await this.associateResourceRecords(wordWallTermRecordIds, 'Vocabulary terms', ['Term'])
          }

          //WordWallTermLinks
          let wordWallTermLinks = [];
          if (Array.isArray(resource["Word wall terms to link"]) && resource["Word wall terms to link"].length) {
            const wordWallTermLinksRecordIds = resourceRecord.get("Word wall terms to link") || [];
            wordWallTermLinks = await this.associateResourceRecords(wordWallTermLinksRecordIds, 'Vocabulary terms', ['Term'])
          }

          //essentialQuestions
          let essentialQuestions = [];
          if (Array.isArray(resource["Learning objectives and essential questions"]) && resource["Learning objectives and essential questions"].length) {
            const essentialQuestionRecordIds = resourceRecord.get("Learning objectives and essential questions") || [];
            essentialQuestions = await this.associateResourceRecords(essentialQuestionRecordIds, 'Learning objectives and essential questions', ['Title'])
          }

          if ("Journalist(s) or SME" in resource) {
            updatedPayload.journalist = journalists || [];
          }

          if ("Word wall terms" in resource) {
            updatedPayload.wordWallTerms = wordWallTerms
          }

          if ("Word wall terms to link" in resource) {
            updatedPayload.wordWallTermLinks = wordWallTermLinks
          }

          if ("Learning objectives and essential questions" in resource) {
            updatedPayload.essentialQuestions = essentialQuestions
          }

          // linksToContent
          const linksToContent: LinksToContentInput[] = [];
          const { "Name of link": name1, "Link to content (1)": url1, "Name of link (2)": name2, "Link to content (2)": url2 } = resource;
          if (name1 || url1) {
            linksToContent.push({ name: name1 || "", url: url1 || "" });
          }
          if (name2 !== undefined || url2 !== undefined) {
            linksToContent.push({ name: name2 || "", url: url2 || "" });
          }

          if (linksToContent.length > 0) {
            updatedPayload.linksToContent = linksToContent
          }

          return {
            recordId: resource["id"],
            resourceId: resource["Resource ID"],
            ...updatedPayload,
          };
        })
      )
    }
    catch (err) {
      console.log("updatecleanResources are in catch", err);
    }
  }





  async createResource(resourcePayload: any, operation?: resourceOperations): Promise<Resource | null> {
    let newResource = await this.resourcesRepository.findOne({
      where: [
        { recordId: resourcePayload.recordId }, { resourceId: resourcePayload.resourceId }
      ]
    })

    //Resource is already created
    if (newResource && operation === "Add") {
      return null;
    }

    if (!newResource && operation === "Update") {
      return null;
    }

    if (!newResource) {
      newResource = this.resourcesRepository.create({
        recordId: resourcePayload.recordId,
        resourceId: resourcePayload.resourceId,
        primaryImage: resourcePayload.primaryImage,
        thumbnailImage: resourcePayload.thumbnailImage,
        contentTitle: resourcePayload.contentTitle && resourcePayload.contentTitle.trim() != 'N/A' && resourcePayload.contentTitle.trim() != '' ? resourcePayload.contentTitle.trim() : null,
        contentDescription: resourcePayload.contentDescription && resourcePayload.contentDescription.trim() != 'N/A' && resourcePayload.contentDescription.trim() != '' ? resourcePayload.contentDescription.trim() : null,
        estimatedTimeToComplete: resourcePayload.estimatedTimeToComplete && resourcePayload.estimatedTimeToComplete.trim() != 'N/A' && resourcePayload.estimatedTimeToComplete.trim() != '' ? resourcePayload.estimatedTimeToComplete.replace(/\.$/, '').trim() : null,
        linkToDescription: resourcePayload.linkToDescription && resourcePayload.linkToDescription.trim() != 'N/A' && resourcePayload.linkToDescription.trim() != '' ? resourcePayload.linkToDescription : null,
        onlyOnCheckology: resourcePayload.onlyOnCheckology,
        featuredInSift: resourcePayload.featuredInSift,
        checkologyPoints: resourcePayload.checkologyPoints,
        averageCompletedTime: resourcePayload.averageCompletedTime,
        shouldGoToDormant: resourcePayload.shouldGoToDormant,
        status: resourcePayload.status,
        imageGroup: resourcePayload.imageGroup,
        imageStatus: resourcePayload.imageStatus,
        auditStatus: resourcePayload.auditStatus,
        auditLink: resourcePayload.auditLink,
        userFeedBack: resourcePayload.userFeedBack,
        linkToTranscript: resourcePayload.linkToTranscript,
      })
    }

    newResource.journalist = []
    if (resourcePayload.journalist && resourcePayload.journalist.length) {
      newResource.journalist = await this.journalistsService.findByNameOrCreate(resourcePayload.journalist)
    }

    newResource.wordWallTerms = []
    if (resourcePayload.wordWallTerms && resourcePayload.wordWallTerms.length) {
      newResource.wordWallTerms = await this.wordWallTermsService.findByNameOrCreate(resourcePayload.wordWallTerms)
    }


    newResource.wordWallTermLinks = []
    if (resourcePayload.wordWallTermLinks && resourcePayload.wordWallTermLinks.length) {
      newResource.wordWallTermLinks = await this.wordWallTermLinksService.findByNameOrCreate(resourcePayload.wordWallTermLinks)
    }

    newResource.essentialQuestions = []
    if (resourcePayload.essentialQuestions && resourcePayload.essentialQuestions.length) {
      newResource.essentialQuestions = await this.essentialQuestionsService.findByNameOrCreate(resourcePayload.essentialQuestions)
    }


    // Is not used at the moment
    // newResource.prerequisite = []
    // if (resourcePayload.prerequisite) {
    //   newResource.prerequisite = await this.prerequisiteService.findAllByNameOrCreate(resourcePayload.prerequisite)
    // }

    newResource.format = []
    if (resourcePayload.formats && resourcePayload.formats.length) {
      newResource.format = await this.formatService.findByNameOrCreate(resourcePayload.formats)
    }

    newResource.mediaOutletFeatureds = []
    if (resourcePayload.mediaOutletsFeatured && resourcePayload.mediaOutletsFeatured.length) {
      newResource.mediaOutletFeatureds = await this.mediaOutletsFeaturedService.findByNameOrCreate(resourcePayload.mediaOutletsFeatured)
    }

    newResource.mediaOutletMentionds = []
    if (resourcePayload.mediaOutletsMentioned && resourcePayload.mediaOutletsMentioned.length) {
      newResource.mediaOutletMentionds = await this.mediaOutletsMentionedService.findByNameOrCreate(resourcePayload.mediaOutletsMentioned)
    }

    newResource.linksToContent = []
    if (resourcePayload.linksToContent && resourcePayload.linksToContent.length) {
      newResource.linksToContent = await this.contentLinkService.findAllByNameOrCreate(resourcePayload.linksToContent)
    }

    newResource.resourceType = []
    if (resourcePayload.resourceType) {
      newResource.resourceType = await this.resourceTypeService.findAllByNameOrCreate(resourcePayload.resourceType)
    }

    newResource.nlnoTopNavigation = []
    if (resourcePayload.nlnoTopNavigation) {
      newResource.nlnoTopNavigation = await this.nlnTopNavigationService.findAllByNameOrCreate(resourcePayload.nlnoTopNavigation)
    }

    newResource.gradeLevel = []
    if (resourcePayload.gradeLevel) {
      newResource.gradeLevel = await this.gradesService.findAllByNameOrCreate(resourcePayload.gradeLevel);
    }

    newResource.subjectArea = []
    if (resourcePayload.subjectArea) {
      newResource.subjectArea = await this.subjectAreaService.findAllByNameOrCreate(resourcePayload.subjectArea)
    }

    newResource.classRoomNeed = []
    if (resourcePayload.classRoomNeed) {
      newResource.classRoomNeed = await this.classRooomNeedService.findAllByNameOrCreate(resourcePayload.classRoomNeed)
    }



    newResource.nlpStandard = []
    if (resourcePayload.nlpStandard) {
      newResource.nlpStandard = await this.nlpStandardsService.findAllByNameOrCreate(resourcePayload.nlpStandard)
    }

    newResource.newsLiteracyTopic = []
    if (resourcePayload.newsLiteracyTopic) {
      newResource.newsLiteracyTopic = await this.newsLiteracyTopicService.findAllByNameOrCreate(resourcePayload.newsLiteracyTopic)
    }

    newResource.evaluationPreference = []
    if (resourcePayload.evaluationPreference) {
      newResource.evaluationPreference = await this.evaluationPreferenceService.findAllByNameOrCreate(resourcePayload.evaluationPreference)
    }

    newResource.contentWarning = []
    if (resourcePayload.contentWarning) {
      newResource.contentWarning = await this.contentWarningService.findAllByNameOrCreate(resourcePayload.contentWarning)
    }
    newResource.assessmentType = []
    if (resourcePayload.assessmentType) {
      newResource.assessmentType = await this.assessmentTypeService.findByNameOrCreate(resourcePayload.assessmentType)
    }
    return newResource
  }

  async updateResource(resourcePayload: any): Promise<null | Resource> {
    const { journalist, recordId, resourceId, ...rest } = resourcePayload || {}

    let newResource = await this.resourcesRepository.findOne({
      where: [{ recordId: recordId }, { resourceId }],
    })

    console.log("findResources Now ready for update: ", newResource)
    if (!newResource) {
      return null
    }
    Object.assign(newResource, rest);

    //relational fields
    if (journalist) {
      newResource["journalist"] = journalist?.length ? await this.journalistsService.findByNameOrCreate(resourcePayload.journalist) : []
    }

    if ("formats" in resourcePayload) {
      newResource["format"] = resourcePayload.formats && resourcePayload.formats.length ? await this.formatService.findByNameOrCreate(resourcePayload.formats) : []
    }


    if ("mediaOutletsFeatured" in resourcePayload) {
      newResource["mediaOutletFeatureds"] = resourcePayload.mediaOutletsFeatured && resourcePayload.mediaOutletsFeatured.length ? await this.mediaOutletsFeaturedService.findByNameOrCreate(resourcePayload.mediaOutletsFeatured) : []
    }


    if ("mediaOutletsMentioned" in resourcePayload) {
      newResource["mediaOutletMentionds"] = resourcePayload.mediaOutletsMentioned && resourcePayload.mediaOutletsMentioned.length ? await this.mediaOutletsMentionedService.findByNameOrCreate(resourcePayload.mediaOutletsMentioned) : [];
    }

    // if ("prerequisite" in resourcePayload) {
    //   newResource["prerequisite"] = resourcePayload.prerequisite && resourcePayload.prerequisite.length ? await this.prerequisiteService.findAllByNameOrCreate([{ 'Content title': resourcePayload.prerequisite }]) : [];
    // }

    if ("wordWallTerms" in resourcePayload) {
      newResource["wordWallTerms"] = resourcePayload.wordWallTerms && resourcePayload.wordWallTerms.length ? await this.wordWallTermsService.findByTermOrCreate(resourcePayload.wordWallTerms) : [];
    }

    if ("wordWallTermLinks" in resourcePayload) {
      newResource["wordWallTermLinks"] = resourcePayload.wordWallTermLinks && resourcePayload.wordWallTermLinks.length ? await this.wordWallTermLinksService.findByNameOrCreate(resourcePayload.wordWallTermLinks) : [];
    }


    if ("essentialQuestions" in resourcePayload) {
      newResource["essentialQuestions"] = resourcePayload.essentialQuestions && resourcePayload.essentialQuestions.length ? await this.essentialQuestionsService.findByNameOrCreate(resourcePayload.essentialQuestions) : [];
    }


    if ("linksToContent" in resourcePayload) {
      newResource["linksToContent"] = resourcePayload.linksToContent && resourcePayload.linksToContent.length ? await this.contentLinkService.findAllByNameOrCreate(resourcePayload.linksToContent) : [];
    }

    if ("resourceType" in resourcePayload) {
      newResource["resourceType"] = resourcePayload.resourceType && resourcePayload.resourceType.length ? await this.resourceTypeService.findAllByNameOrCreate(resourcePayload.resourceType) : [];
    }


    if ("nlnoTopNavigation" in resourcePayload) {
      newResource["nlnoTopNavigation"] = resourcePayload.nlnoTopNavigation && resourcePayload.nlnoTopNavigation.length ? await this.nlnTopNavigationService.findAllByNameOrCreate(resourcePayload.nlnoTopNavigation) : [];
    }

    if ("gradeLevel" in resourcePayload) {
      newResource["gradeLevel"] = resourcePayload.gradeLevel && resourcePayload.gradeLevel.length ? await this.gradesService.findAllByNameOrCreate(resourcePayload.gradeLevel) : [];
    }


    if ("subjectArea" in resourcePayload) {
      newResource["subjectArea"] = resourcePayload.subjectArea && resourcePayload.subjectArea.length ? await this.subjectAreaService.findAllByNameOrCreate(resourcePayload.subjectArea) : [];
    }


    if ("classRoomNeed" in resourcePayload) {
      newResource["classRoomNeed"] = resourcePayload.classRoomNeed && resourcePayload.classRoomNeed.length ? await this.classRooomNeedService.findAllByNameOrCreate(resourcePayload.classRoomNeed) : [];
    }




    if ("nlpStandard" in resourcePayload) {
      newResource["nlpStandard"] = resourcePayload.nlpStandard && resourcePayload.nlpStandard.length ? await this.nlpStandardsService.findAllByNameOrCreate(resourcePayload.nlpStandard) : [];
    }

    if ("newsLiteracyTopic" in resourcePayload) {
      newResource["newsLiteracyTopic"] = resourcePayload.newsLiteracyTopic && resourcePayload.newsLiteracyTopic.length ? await this.newsLiteracyTopicService.findAllByNameOrCreate(resourcePayload.newsLiteracyTopic) : [];
    }

    if ("evaluationPreference" in resourcePayload) {
      newResource["evaluationPreference"] = resourcePayload.evaluationPreference && resourcePayload.evaluationPreference.length ? await this.evaluationPreferenceService.findAllByNameOrCreate(resourcePayload.evaluationPreference) : [];
    }

    if ("contentWarning" in resourcePayload) {
      newResource["contentWarning"] = resourcePayload.contentWarning && resourcePayload.contentWarning.length ? await this.contentWarningService.findAllByNameOrCreate(resourcePayload.contentWarning) : [];
    }

    if ("assessmentType" in resourcePayload) {
      newResource["assessmentType"] = resourcePayload.assessmentType && resourcePayload.assessmentType.length ? await this.assessmentTypeService.findByNameOrCreate(resourcePayload.assessmentType) : []
    }
    console.log("updateResouce func -> ", newResource)
    return newResource ? newResource : null;



  }

  async saveEntities(entities: Resource[]): Promise<Resource[] | null> {

    if (entities) {
      const savedEntities = await this.resourcesRepository.save(entities);
      return savedEntities;
    }
    return null;
  }

  async deleteMany(resourceIds: string[]): Promise<Boolean> {
    try {
      const { affected } = await this.resourcesRepository.delete({ recordId: In(resourceIds) });
      if (affected > 0) {
        return true;
      }
    }
    catch (error) {
      return false;
      // throw new InternalServerErrorException(error);
    }
  }

  async synchronizeAirtableUpdatedData(payload: NotifyPayload): Promise<null | Resource[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //fetch updated records payload from the airtable BASE endpoint
      const updatedResources = await this.cronServices.updateRecords(payload);

      const updateResourcesEntities: any[] = []
      if (updatedResources) {
        //clean updated records data payload
        const cleanResources = await this.updatecleanResources(updatedResources);
        console.log("updatecleanResources: ", cleanResources)
        for (let resource of cleanResources) {
          //update that resource with updated airtable resource
          const updateResource = await this.updateResource(resource)
          console.log("updateResource->>>>>>>>>>>>>>>>          ", updateResource)
          if (updateResource) {
            updateResourcesEntities.push(updateResource)
          }
        }
        console.log("updatedResources---------------------------LAST---------------: ", updateResourcesEntities)
      }
      if (updateResourcesEntities && updateResourcesEntities.length) {
        //save updated resources entities that coming from the airtable payload
        const updatedResources = await queryRunner.manager.save<Resource>(updateResourcesEntities);
        await queryRunner.commitTransaction();
        return updatedResources
      }
      return null
    }
    catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

  }

  async synchronizeAirtableAddedData(payload: NotifyPayload): Promise<Resource[] | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newResources = await this.cronServices.checkNewRecord(payload)
      let newResourcesEntities = []
      if (newResources) {
        const cleanResources = await this.cleanResources(newResources);
        for (let resource of cleanResources) {
          const newResource = await this.createResource(resource, "Add")
          if (newResource) {
            newResourcesEntities.push(newResource)
          }
        }
        console.log("newResources--------------------: ", newResourcesEntities)
      }
      if (newResourcesEntities) {
        const newResources = await queryRunner.manager.save<Resource>(newResourcesEntities);
        await queryRunner.commitTransaction();
        return newResources
      }
      return null
    }
    catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async synchronizeAirtableRemoveData(payload: NotifyPayload): Promise<Boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const detroyIds = await this.cronServices.removeRecords(payload)
      console.log("<------------------delete-destroyIds------------------>: ", detroyIds)

      const checkResourcesDeleted = await this.deleteMany(detroyIds)
      await queryRunner.commitTransaction();
      return checkResourcesDeleted
    }
    catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

  }

  @Cron('*/10 * * * *') // '0 0 */6 * *' Every 10th minute
  async syncNewRecirdsData() {
    const addPayload: NotifyPayload = {
      base: {
        id: this.configService.get<string>('educatorBaseId')
      },
      webhook: {
        id: `${this.checkNewRecordsWebHookId}` || "achIRaLfA8hXpoc7J"
      },
      timestamp: "2022-07-17T21:25:05.663Z"
    }

    await this.synchronizeAirtableAddedData(addPayload)

    const updatePayload: NotifyPayload = {
      base: {
        id: this.configService.get<string>('educatorBaseId')
      },
      webhook: {
        id: `${this.updateRecordsWebHookId}` || "achw3cqQRFHd1k0go"
      },
      timestamp: "2022-07-17T21:25:05.663Z"
    }

    await this.synchronizeAirtableUpdatedData(updatePayload)

    const removePayload: NotifyPayload = {
      base: {
        id: this.configService.get<string>('educatorBaseId')
      },
      webhook: {
        id: `${this.deletedRecordsWebHookId}` || "ach9J0CJTosMUhP9t"
      },
      timestamp: "2022-07-17T21:25:05.663Z"
    }

    await this.synchronizeAirtableRemoveData(removePayload)
  }

}
