import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UtilsService } from "../../util/utils.service";
import { DataSource, Repository, In, FindOperator, Raw, Not, ILike } from "typeorm";
import { CreateResourceInput } from "../dto/resource-input.dto";
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

import { JournalistInput } from "../../journalists/dto/journalist.input.dto";
import { ResourceTypeInput } from "../../resourceType/dto/resource-type.input.dto";
import { NLNOTopNavigationInput } from "../../nlnoTopNavigation/dto/nlno-top-navigation.input.dto";
import { ClassRoomNeedInput } from "../../classRoomNeeds/dto/classroom-need.input.dto";
import { SubjectAreaInput } from "../../subjectArea/dto/subject-area.input.dto";
import { NewsLiteracyTopicInput } from "../../newLiteracyTopic/dto/newsliteracy-topic.input.dto";
import { ContentWarningInput } from "../../contentWarnings/dto/content-warning.input.dto";
import { EvaluationPreferenceInput } from "../../evaluationPreferences/dto/evaluation-preference.input.dto";
import { AssessmentTypeInput } from "../../assessmentTypes/dto/assessment-type-input.dto";
import { GradeInput } from "../../grade/dto/grade-level.input.dto";
import { WordWallTermInput } from "../../wordWallTerms/dto/word-wall-terms.input";
import { wordWallTermLinkInput } from "../../wordWallTermLinks/dto/word-wall-term-link.input.dto";
import { MediaOutletFeaturedInput } from "../../mediaOutletFeatured/dto/media-outlet-featured.input.dto";
import { MediaOutletMentiondInput } from "../../mediaOutletMentioned/dto/media-outlet-mentioned.input.dto";
import { EssentialQuestionInput } from "../../essentialQuestions/dto/essential-question.input.dto";
import { FormatInput } from "../../format/dto/format.input.dto";

type resourceOperations = "Add" | "Update"

type UpdateCleanPayload = {
  checkologyPoints?: number;
  averageCompletedTime?: string;
  shouldGoToDormant?: string;
  status?: string;
  imageGroup?: string;
  imageStatus?: string;
  auditStatus?: string;
  auditLink?: string;
  userFeedBack?: string;
  linkToTranscript?: string;
  contentTitle?: string;
  contentDescription?: string;
  linkToDescription?: string;
  onlyOnCheckology?: boolean | string;
  featuredInSift?: boolean | string;
  estimatedTimeToComplete?: number | string;
  formats?: Array<FormatInput> | null | [];
  journalist?: Array<JournalistInput> | null | [];
  resourceType?: Array<ResourceTypeInput> | null;
  nlnoTopNavigation?: Array<NLNOTopNavigationInput> | null;
  classRoomNeed?: Array<ClassRoomNeedInput> | null;
  nlpStandard?: Array<NlpStandardInput> | null;
  subjectArea?: Array<SubjectAreaInput> | null;
  newsLiteracyTopic?: Array<NewsLiteracyTopicInput> | null;
  contentWarning?: Array<ContentWarningInput> | null;
  evaluationPreference?: Array<EvaluationPreferenceInput> | null;
  assessmentType?: Array<AssessmentTypeInput> | null;
  prerequisite?: string | null;
  gradeLevel?: Array<GradeInput> | null;
  wordWallTerms?: Array<WordWallTermInput> | null;
  wordWallTermLinks?: Array<wordWallTermLinkInput> | null;
  mediaOutletsFeatured?: Array<MediaOutletFeaturedInput> | null;
  mediaOutletsMentioned?: Array<MediaOutletMentiondInput> | null;
  essentialQuestions?: Array<EssentialQuestionInput> | null;
  linksToContent?: Array<LinksToContentInput> | null;
}

type RawResource = {
  'Checkology points'?: number;
  "Average completion times"?: string;
  "Why should it go dormant?"?: string;
  "Status"?: string;
  "Image group"?: string;
  "Image status"?: string;
  "Audit status"?: string;
  "Link to audit"?: string;
  "User feedback"?: string;
  "Link to transcript"?: string;
  "Content title"?: string;
  '"About" text'?: string;
  "Link to description"?: string;
  "Only on Checkology"?: boolean | string;
  "Format(s)"?: Array<string> | null | [];
  "Journalist(s) or SME"?: null | string;
  "Journalist or SME organization(s)"?: null | string;
  "Name of link"?: string;
  "Link to content (1)"?: string;
  "Name of link (2)"?: string;
  "Link to content (2)"?: string;
  "NLP standards"?: Array<string> | null | [];
  "Resource type (USE THIS)"?: Array<string> | null;
  "NLNO top navigation"?: Array<string> | null;
  "Classroom needs"?: Array<string> | null;
  "Subject areas"?: Array<string> | null;
  "News literacy topics"?: Array<string> | null;
  "Content warnings"?: Array<string> | null;
  "Evaluation preference"?: Array<string> | null;
  "Assessment types"?: Array<string> | null;
  "Prerequisites/related"?: string | null;
  "Grade level/band"?: Array<string> | null;
  "Word wall terms"?: string | null;
  "Word wall terms to link"?: string | null;
  " Media outlets featured"?: Array<string> | null;
  " Media outlets mentioned"?: Array<string> | null;
}

@Injectable()
export class ResourcesService {
  // private airtable: Airtable;
  private base: Base;
  private config: AxiosRequestConfig;
  private readonly tableId: string;
  private educatorBaseId: Base;
  private readonly educatorTableId: string;
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
      newResource.prerequisite = await this.prerequisiteService.findAllByNameOrCreate(createResourceInput.prerequisites)
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
      resource.prerequisite = await this.prerequisiteService.findAllByNameOrCreate(updateResourceInput.prerequisites)
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
      const nlpStandards = await this.nlpStandardsService.findAllByName()
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
    const { limit, page } = resourceInput.paginationOptions
    const { searchString, orderBy, alphabetic, mostRelevant, estimatedTimeToComplete, resourceTypes, evaluationPreferences, formats, classRoomNeeds, nlpStandards, gradeLevels, subjects, topics } = resourceInput

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
  async dumpAllRecordsOfAirtable() {
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
      throw error;
    }
    finally {
      await queryRunner.release();
    }
  }

  async cleanResources(recources: Array<any>) {

    const resourceCleanData = removeEmojisFromArray(recources);
    return resourceCleanData.map(resource => {
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
      const journalistNames = resource["Journalist(s) or SME"] && resource["Journalist(s) or SME"].length ? resource["Journalist(s) or SME"].split(",").map(name => ({ name })) : "";
      const journalistOrganization = resource["Journalist or SME organization(s)"] && resource["Journalist or SME organization(s)"].length ? resource["Journalist or SME organization(s)"].split(",") : "";
      const journalists = journalistNames && journalistNames.map((journalistObj, index) => ({
        name: journalistObj.name,
        organization: journalistOrganization[index] || "",
      }));

      return {
        recordId: resource['id'],
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
        journalist: journalists ? journalists : "",
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
        prerequisite: resource["Prerequisites/related"] && resource["Prerequisites/related"].length ? resource["Prerequisites/related"] : "",
        gradeLevel: resource["Grade level/band"] && resource["Grade level/band"].length ? resource["Grade level/band"].filter(grade => grade !== 'N/A') : "",
        wordWallTerms: resource["Word wall terms"] && resource["Word wall terms"].length ? resource["Word wall terms"].split(",").map(name => ({ name: name.trim() })) : "",
        wordWallTermLinks: resource["Word wall terms to link"] && resource["Word wall terms to link"].length ? resource["Word wall terms to link"].split(",").map(name => ({ name })) : "",
        mediaOutletsFeatured: resource[" Media outlets featured"] && resource[" Media outlets featured"].length ? resource[" Media outlets featured"].map(name => ({ name: name.trim() })) : "",
        mediaOutletsMentioned: resource[" Media outlets mentioned"] && resource[" Media outlets mentioned"].length ? resource[" Media outlets mentioned"].map(name => ({ name })) : "",
        essentialQuestions: resource["Learning objectives and essential questions"] && resource["Learning objectives and essential questions"].length ? resource["Learning objectives and essential questions"].split(/[.,]+|\? |\?,/).map(name => ({ name: name.replace(/[^a-zA-Z0-9 ?,.!]+/g, '').trim() })) : "",
      };
    });

  }


  private assignFieldIfExists<T, K extends keyof T>(
    payload: T,
    resource: RawResource,
    field: string,
    propertyName: K,
    isBoolean = false,
    transformFn?: (value: any) => T[K]
  ): void {
    if (field in resource) {
      const value = resource[field] || (isBoolean ? false : null);
      payload[propertyName] = transformFn ? transformFn(value) : value;
    }
  }

  private assignArrayFieldIfExists<T, K extends keyof T>(
    payload: T,
    resource: Record<string, any>,
    field: string,
    propertyName: K,
    mapperFn?: (value: string) => any,
    filterFn?: (item: any) => boolean
  ): void {
    if (field in resource) {
      const values = resource[field].map((name: string) => mapperFn ? mapperFn(name.trim()) : { name: name.trim() }) || [];
      payload[propertyName] = filterFn ? values.filter(filterFn) : values;
    }
  }


  async updatecleanResources(resources: RawResource[]): Promise<any[]> {
    const resourceCleanData = removeEmojisFromArray(resources);

    return resourceCleanData.map((resource: RawResource) => {
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
      this.assignFieldIfExists(updatedPayload, resource, "Link to description", "linkToDescription");
      this.assignFieldIfExists(updatedPayload, resource, "Only on Checkology", "onlyOnCheckology", true);
      this.assignFieldIfExists(updatedPayload, resource, "Featured in the Sift", "featuredInSift", true);
      this.assignFieldIfExists(updatedPayload, resource, " Estimated time to complete", "estimatedTimeToComplete");

      this.assignFieldIfExists(updatedPayload, resource, "Prerequisites/related", "prerequisite");

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
      this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Word wall terms", "wordWallTerms", name => ({ name: name.trim() }));
      this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Word wall terms to link", "wordWallTermLinks", name => ({ name: name.trim() }));
      this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, " Media outlets featured", "mediaOutletsFeatured", name => ({ name: name.trim() }));
      this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, " Media outlets mentioned", "mediaOutletsMentioned", name => ({ name }));
      this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Learning objectives and essential questions", "essentialQuestions", name => ({ name: name.replace(/[^a-zA-Z0-9 ?,.!]+/g, '').trim() }));
      this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "NLP standards", "nlpStandard", (str) => {
        const [name, description] = str.split(":");
        return { name, description: description.trim() };
      });
      this.assignArrayFieldIfExists<UpdateCleanPayload, keyof UpdateCleanPayload>(updatedPayload, resource, "Format(s)", "formats", name => ({ name }));

      // Journalist
      const journalistNames = resource["Journalist(s) or SME"]?.split(",") || [];
      const journalistOrganization = resource["Journalist or SME organization(s)"]?.split(",") || [];
      const journalists = journalistNames.map((name, index) => ({
        name,
        organization: journalistOrganization[index] || "",
      }));
      if ("Journalist(s) or SME" in resource) {
        updatedPayload.journalist = journalists || [];
      }

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
        ...updatedPayload,
      };
    });
  }





  async createResource(resourcePayload: any, operation?: resourceOperations) {
    let newResource = await this.resourcesRepository.findOne({
      where: {
        recordId: resourcePayload.recordId
      }
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
        contentTitle: resourcePayload.contentTitle.trim() != 'N/A' && resourcePayload.contentTitle.trim() != '' ? resourcePayload.contentTitle.trim() : null,
        contentDescription: resourcePayload.contentDescription.trim() != 'N/A' && resourcePayload.contentDescription.trim() != '' ? resourcePayload.contentDescription.trim() : null,
        estimatedTimeToComplete: resourcePayload.estimatedTimeToComplete.trim() != 'N/A' && resourcePayload.estimatedTimeToComplete.trim() != '' ? resourcePayload.estimatedTimeToComplete.replace(/\.$/, '').trim() : null,
        linkToDescription: resourcePayload.linkToDescription.trim() != 'N/A' && resourcePayload.linkToDescription.trim() != '' ? resourcePayload.linkToDescription : null,
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
    if (resourcePayload.journalist.length) {
      newResource.journalist = await this.journalistsService.findByNameOrCreate(resourcePayload.journalist)
    }

    newResource.format = []
    if (resourcePayload.formats.length) {
      newResource.format = await this.formatService.findByNameOrCreate(resourcePayload.formats)
    }

    newResource.mediaOutletFeatureds = []
    if (resourcePayload.mediaOutletsFeatured.length) {
      newResource.mediaOutletFeatureds = await this.mediaOutletsFeaturedService.findByNameOrCreate(resourcePayload.mediaOutletsFeatured)
    }

    newResource.mediaOutletMentionds = []
    if (resourcePayload.mediaOutletsMentioned.length) {
      newResource.mediaOutletMentionds = await this.mediaOutletsMentionedService.findByNameOrCreate(resourcePayload.mediaOutletsMentioned)
    }

    newResource.wordWallTerms = []
    if (resourcePayload.wordWallTerms.length) {
      newResource.wordWallTerms = await this.wordWallTermsService.findByNameOrCreate(resourcePayload.wordWallTerms)
    }


    newResource.wordWallTermLinks = []
    if (resourcePayload.wordWallTermLinks.length) {
      newResource.wordWallTermLinks = await this.wordWallTermLinksService.findByNameOrCreate(resourcePayload.wordWallTermLinks)
    }

    newResource.essentialQuestions = []
    if (resourcePayload.essentialQuestions.length) {
      newResource.essentialQuestions = await this.essentialQuestionsService.findByNameOrCreate(resourcePayload.essentialQuestions)
    }

    newResource.linksToContent = []
    if (resourcePayload.linksToContent.length) {
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

    newResource.prerequisite = []
    if (resourcePayload.prerequisite) {
      newResource.prerequisite = await this.prerequisiteService.findAllByNameOrCreate([{ name: resourcePayload.prerequisite }])
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

  async updateResource(resourcePayload: any): Promise<null | object> {

    console.log("resourcePayload: ------------- ", resourcePayload)

    let newResource = await this.resourcesRepository.findOne({
      where: {
        recordId: resourcePayload.recordId
      }
    })

    if (!newResource) {
      return null
    }

    if (newResource) {

      this.assignFieldIfExists(newResource, resourcePayload, "contentTitle", "contentTitle");
      this.assignFieldIfExists(newResource, resourcePayload, "contentDescription", "contentDescription");
      this.assignFieldIfExists(newResource, resourcePayload, "estimatedTimeToComplete", "estimatedTimeToComplete", false, (value: string) =>
        value.replace(/\.$/, "").trim()
      );
      this.assignFieldIfExists(newResource, resourcePayload, "linkToDescription", "linkToDescription");
      this.assignFieldIfExists(newResource, resourcePayload, "onlyOnCheckology", "onlyOnCheckology");
      this.assignFieldIfExists(newResource, resourcePayload, "featuredInSift", "featuredInSift");
      this.assignFieldIfExists(newResource, resourcePayload, "checkologyPoints", "checkologyPoints");
      this.assignFieldIfExists(newResource, resourcePayload, "averageCompletedTime", "averageCompletedTime");
      this.assignFieldIfExists(newResource, resourcePayload, "shouldGoToDormant", "shouldGoToDormant");
      this.assignFieldIfExists(newResource, resourcePayload, "status", "status");
      this.assignFieldIfExists(newResource, resourcePayload, "imageGroup", "imageGroup");
      this.assignFieldIfExists(newResource, resourcePayload, "imageStatus", "imageStatus");
      this.assignFieldIfExists(newResource, resourcePayload, "auditStatus", "auditStatus");
      this.assignFieldIfExists(newResource, resourcePayload, "auditLink", "auditLink");
      this.assignFieldIfExists(newResource, resourcePayload, "userFeedBack", "userFeedBack");
      this.assignFieldIfExists(newResource, resourcePayload, "linkToTranscript", "linkToTranscript");


      //relational fields
      if ("journalist" in resourcePayload) {
        this.assignArrayFieldIfExists(
          newResource,
          resourcePayload,
          "journalist",
          "journalist",
          async (str: string) => {
            if (str.length) {
              const journalistInput: JournalistInput[] = [{ name: str }];
              const journalist = await this.journalistsService.findByNameOrCreate(journalistInput);
              return journalist ? [journalist] : [];
            } else {
              return [];
            }
          }
        );
      }

      this.assignArrayFieldIfExists(newResource, resourcePayload, "formats", "format", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "mediaOutletsFeatured", "mediaOutletFeatureds", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "mediaOutletsMentioned", "mediaOutletMentionds", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "wordWallTerms", "wordWallTerms", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "wordWallTermLinks", "wordWallTermLinks", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "essentialQuestions", "essentialQuestions", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "linksToContent", "linksToContent", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "resourceType", "resourceType", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "nlnoTopNavigation", "nlnoTopNavigation", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "gradeLevel", "gradeLevel", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "subjectArea", "subjectArea", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "classRoomNeed", "classRoomNeed", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "prerequisite", "prerequisite", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "nlpStandard", "nlpStandard", (str: string) => {
        const [name, description] = str.split(":");
        return { name, description: description.trim() };
      });
      this.assignArrayFieldIfExists(newResource, resourcePayload, "newsLiteracyTopic", "newsLiteracyTopic", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "evaluationPreference", "evaluationPreference", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "contentWarning", "contentWarning", (name: string) => ({ name }));
      this.assignArrayFieldIfExists(newResource, resourcePayload, "assessmentType", "assessmentType", (name: string) => ({ name }));




      return newResource ? newResource : null;
    }



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

  async synchronizeAirtableUpdatedData() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //fetch updated records payload from the airtable BASE endpoint
      const updatedResources = await this.cronServices.updateRecords()
      const updateResourcesEntities = []
      if (updatedResources) {
        //clean updated records data payload
        const cleanResources = await this.updatecleanResources(updatedResources);
        for (let resource of cleanResources) {
          //update that resource with updated airtable resource
          const newResource = await this.updateResource(resource)
          if (newResource) {
            updateResourcesEntities.push(newResource)
          }
        }
        console.log("updatedResources---------------------------LAST---------------: ", updateResourcesEntities)
      }
      if (updateResourcesEntities && updateResourcesEntities.length) {
        //save updated resources entities that coming from the airtable payload
        const updatedResources = await queryRunner.manager.save(updateResourcesEntities);
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

  async synchronizeAirtableAddedData(){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
      const newResources = await this.cronServices.checkNewRecord()
      let newResourcesEntities = []
      if(newResources) {
        const cleanResources = await this.cleanResources(newResources);
        for(let resource of cleanResources) {
          const newResource =await this.createResource(resource)
          if(newResource){
            newResourcesEntities.push(newResource)
          }
        }
        console.log("newResources: ",newResourcesEntities)	
      }
      if(newResourcesEntities){
        const newResources = await queryRunner.manager.save(newResourcesEntities);
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

}
