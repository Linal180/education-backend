import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RESOURCES } from "src/users/auth/constants";
import { Connection, In, Repository } from "typeorm";
import { CreateResourceInput } from "../dto/resource-input.dto";
import ResourceInput from "../dto/resource-payload.dto";
import { UpdateResourceInput } from "../dto/update-resource.input";
import { AssessmentType } from "../entities/assessement-type.entity";
import { ClassRoomNeed } from "../entities/classroom-needs.entity";
import { ContentLink } from "../entities/content-link.entity";
import { ContentWarning } from "../entities/content-warning.entity";
import { EvaluationPreference } from "../entities/evaluation-preference.entity";
import { Format } from "../entities/format.entity";
import { Grade } from "../entities/grade-levels.entity";
import { Journalist } from "../entities/journalist.entity";
import { NewsLiteracyTopic } from "../entities/newliteracy-topic.entity";
import { NLNOTopNavigation } from "../entities/nlno-top-navigation.entity";
import { NlpStandard } from "../entities/nlp-standard.entity";
import { Prerequisite } from "../entities/prerequisite.entity";
import { ResourceType } from "../entities/resource-types.entity";
import { Resource } from "../entities/resource.entity";
import { SubjectArea } from "../entities/subject-areas.entity";

@Injectable()
export class ResourcesService {
  constructor(
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
    private connection: Connection,
  ) {}


  /**
   * 
   * @param createResourceInput 
   * @returns 
   */
  async create(createResourceInput: CreateResourceInput): Promise<Resource>  {
    const queryRunner = this.connection.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const newResource = this.resourcesRepository.create(createResourceInput);
      newResource.journalist = await this.getOrCreateEntities(this.journalistRepository, createResourceInput.journalists, 'name');
      newResource.linksToContent = await this.getOrCreateEntities(this.contentLinkRepository, createResourceInput.linksToContents, 'name', true);
      newResource.resourceType = await this.getOrCreateEntities(this.resourceTypeRepository, createResourceInput.resourceTypes, 'name');
      newResource.nlnoTopNavigation = await this.getOrCreateEntities(this.nlnoTopNavigationRepository, createResourceInput.nlnoTopNavigations, 'name');
      newResource.format = await this.getOrCreateEntities(this.formatRepository, createResourceInput.formats, 'name');
      newResource.gradeLevel = await this.getOrCreateEntities(this.gradeRepository, createResourceInput.gradeLevels, 'name');
      newResource.classRoomNeed = await this.getOrCreateEntities(this.classRoomNeedRepository, createResourceInput.classRoomNeeds, 'name');
      newResource.subjectArea = await this.getOrCreateEntities(this.subjectAreaRepository, createResourceInput.subjectAreas, 'name');
      newResource.prerequisite = await this.getOrCreateEntities(this.prerequisiteRepository, createResourceInput.prerequisites, 'name');
      newResource.nlpStandard = await this.getOrCreateEntities(this.nlpStandardRepository, createResourceInput.nlpStandards, 'name');
      newResource.newsLiteracyTopic = await this.getOrCreateEntities(this.newsLiteracyTopicRepository, createResourceInput.newsLiteracyTopics, 'name');
      newResource.evaluationPreference = await this.getOrCreateEntities(this.evaluationPreferenceRepository, createResourceInput.evaluationPreferences, 'name');
      newResource.contentWarning = await this.getOrCreateEntities(this.contentWarningRepository, createResourceInput.contentWarnings, 'name');
      newResource.assessmentType = await this.getOrCreateEntities(this.assessmentTypeRepository, createResourceInput.assessmentTypes, 'name');

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
  const queryRunner = this.connection.createQueryRunner();
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
    resource.journalist = await this.getOrCreateEntities(this.journalistRepository, updateResourceInput.journalists, 'name');
    resource.linksToContent = await this.getOrCreateEntities(this.contentLinkRepository, updateResourceInput.linksToContents, 'name', true);
    resource.resourceType = await this.getOrCreateEntities(this.resourceTypeRepository, updateResourceInput.resourceTypes, 'name');
    resource.nlnoTopNavigation = await this.getOrCreateEntities(this.nlnoTopNavigationRepository, updateResourceInput.nlnoTopNavigations, 'name');
    resource.format = await this.getOrCreateEntities(this.formatRepository, updateResourceInput.formats, 'name');
    resource.gradeLevel = await this.getOrCreateEntities(this.gradeRepository, updateResourceInput.gradeLevels, 'name');
    resource.classRoomNeed = await this.getOrCreateEntities(this.classRoomNeedRepository, updateResourceInput.classRoomNeeds, 'name');
    resource.subjectArea = await this.getOrCreateEntities(this.subjectAreaRepository, updateResourceInput.subjectAreas, 'name');
    resource.prerequisite = await this.getOrCreateEntities(this.prerequisiteRepository, updateResourceInput.prerequisites, 'name');
    resource.nlpStandard = await this.getOrCreateEntities(this.nlpStandardRepository, updateResourceInput.nlpStandards, 'name');
    resource.newsLiteracyTopic = await this.getOrCreateEntities(this.newsLiteracyTopicRepository, updateResourceInput.newsLiteracyTopics, 'name');
    resource.evaluationPreference = await this.getOrCreateEntities(this.evaluationPreferenceRepository, updateResourceInput.evaluationPreferences, 'name');
    resource.contentWarning = await this.getOrCreateEntities(this.contentWarningRepository, updateResourceInput.contentWarnings, 'name');
    resource.assessmentType = await this.getOrCreateEntities(this.assessmentTypeRepository, updateResourceInput.assessmentTypes, 'name');

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
async getOrCreateEntities(repository, entities, field, save = false) {
  const newEntities = [];
  for (const entity of entities) {
    let dbEntity = await repository.findOne({ where: { [field]: entity[field].toLowerCase() } });
    if (!dbEntity) {
      dbEntity = repository.create({ [field]: entity[field].toLowerCase() });
      if (save) {
        await repository.save(dbEntity);
      }
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
 * @param offset 
 * @param limit 
 * @returns 
 */
async find(resourceInput: ResourceInput) {
    return {}
}

/**
 * 
 * @param id 
 * @returns 
 */
async getJournalist(id: string): Promise<Journalist> {
  return await this.journalistRepository.findOne({ where: { id } });
}

/**
 * Removes resource
 * @param id 
 */
async removeResource(id) {
    try {
      await this.resourcesRepository.delete(id)
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}
