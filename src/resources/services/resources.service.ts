import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { CreateResourceInput } from "../dto/resource-input.dto";
import ResourceInput, { ResourcesPayload } from "../dto/resource-payload.dto";
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
      newResource.journalist = await this.getOrCreateEntities(this.journalistRepository, createResourceInput.journalists, ['name']);
      newResource.linksToContent = await this.getOrCreateEntities(this.contentLinkRepository, createResourceInput.linksToContents, ['name', 'url'], true);
      newResource.resourceType = await this.getOrCreateEntities(this.resourceTypeRepository, createResourceInput.resourceTypes, ['name']);
      newResource.nlnoTopNavigation = await this.getOrCreateEntities(this.nlnoTopNavigationRepository, createResourceInput.nlnoTopNavigations, ['name']);
      newResource.format = await this.getOrCreateEntities(this.formatRepository, createResourceInput.formats, ['name']);
      newResource.gradeLevel = await this.getOrCreateEntities(this.gradeRepository, createResourceInput.gradeLevels, ['name']);
      newResource.classRoomNeed = await this.getOrCreateEntities(this.classRoomNeedRepository, createResourceInput.classRoomNeeds, ['name']);
      newResource.subjectArea = await this.getOrCreateEntities(this.subjectAreaRepository, createResourceInput.subjectAreas, ['name']);
      newResource.prerequisite = await this.getOrCreateEntities(this.prerequisiteRepository, createResourceInput.prerequisites, ['name']);
      newResource.nlpStandard = await this.getOrCreateEntities(this.nlpStandardRepository, createResourceInput.nlpStandards, ['name', 'description']);
      newResource.newsLiteracyTopic = await this.getOrCreateEntities(this.newsLiteracyTopicRepository, createResourceInput.newsLiteracyTopics, ['name']);
      newResource.evaluationPreference = await this.getOrCreateEntities(this.evaluationPreferenceRepository, createResourceInput.evaluationPreferences, ['name']);
      newResource.contentWarning = await this.getOrCreateEntities(this.contentWarningRepository, createResourceInput.contentWarnings, ['name']);
      newResource.assessmentType = await this.getOrCreateEntities(this.assessmentTypeRepository, createResourceInput.assessmentTypes, ['name']);

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
    resource.journalist = await this.getOrCreateEntities(this.journalistRepository, updateResourceInput.journalists, ['name']);
    resource.linksToContent = await this.getOrCreateEntities(this.contentLinkRepository, updateResourceInput.linksToContents, ['name'], true);
    resource.resourceType = await this.getOrCreateEntities(this.resourceTypeRepository, updateResourceInput.resourceTypes, ['name', 'url']);
    resource.nlnoTopNavigation = await this.getOrCreateEntities(this.nlnoTopNavigationRepository, updateResourceInput.nlnoTopNavigations, ['name']);
    resource.format = await this.getOrCreateEntities(this.formatRepository, updateResourceInput.formats, ['name']);
    resource.gradeLevel = await this.getOrCreateEntities(this.gradeRepository, updateResourceInput.gradeLevels, ['name']);
    resource.classRoomNeed = await this.getOrCreateEntities(this.classRoomNeedRepository, updateResourceInput.classRoomNeeds, ['name']);
    resource.subjectArea = await this.getOrCreateEntities(this.subjectAreaRepository, updateResourceInput.subjectAreas, ['name']);
    resource.prerequisite = await this.getOrCreateEntities(this.prerequisiteRepository, updateResourceInput.prerequisites, ['name']);
    resource.nlpStandard = await this.getOrCreateEntities(this.nlpStandardRepository, updateResourceInput.nlpStandards, ['name', 'description']);
    resource.newsLiteracyTopic = await this.getOrCreateEntities(this.newsLiteracyTopicRepository, updateResourceInput.newsLiteracyTopics, ['name']);
    resource.evaluationPreference = await this.getOrCreateEntities(this.evaluationPreferenceRepository, updateResourceInput.evaluationPreferences, ['name']);
    resource.contentWarning = await this.getOrCreateEntities(this.contentWarningRepository, updateResourceInput.contentWarnings, ['name']);
    resource.assessmentType = await this.getOrCreateEntities(this.assessmentTypeRepository, updateResourceInput.assessmentTypes, ['name']);

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
async getOrCreateEntities(repository, entities, fields, save = false) {
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


async find(resourceInput: ResourceInput): Promise<ResourcesPayload> {
  const {limit, page}  = resourceInput.paginationOptions
  const {searchString, orderBy, alphabetic, mostRelevant, estimatedTimeToComplete, resourceType, evaluationPreference, format, classRoomNeed, nlpStandard, gradeLevel, subject, topic} = resourceInput
  const query = this.resourcesRepository.createQueryBuilder('resource');

  //search based on title of content 
  if (searchString) {
    query.where(`resource.contentTitle LIKE :searchString`, { searchString: `${searchString}%` })
  }
  //filter by most relevant
  if (mostRelevant) {
    query.where(`to_tsvector('english', resource.contentTitle) @@ to_tsquery('english', :mostRelevant)`, { mostRelevant: `${mostRelevant}:*` })
      .addSelect(`ts_rank(to_tsvector(resource.contentTitle), to_tsquery(:mostRelevant))`, 'rank')
      .orderBy('rank', 'DESC');
  }

  // filter by resource estimated time to complete
  if (estimatedTimeToComplete) {
    query.where('resource.estimatedTimeToComplete = :name', { name: estimatedTimeToComplete });
  }

  // filter by resource type name
  if (resourceType) {
    query.leftJoin('resource.resourceType', 'resourceType');
    query.where('resourceType.name = :name', { name: resourceType });
  }

  // filter by resource evaluation Preference
  if (evaluationPreference) {
    query.leftJoin('resource.evaluationPreference', 'evaluationPreference');
    query.where('evaluationPreference.name = :name', { name: evaluationPreference });
  }

  // filter by resource format
  if (format) {
    query.leftJoin('resource.format', 'format');
    query.where('format.name = :name', { name: format });
  }

  // filter by resource classRoom need
  if (classRoomNeed) {
    query.leftJoin('resource.classRoomNeed', 'classRoomNeed');
    query.where('classRoomNeed.name = :name', { name: classRoomNeed });
  }
    
  // filter by resource nlp Standard
  if (nlpStandard) {
    query.leftJoin('resource.nlpStandard', 'nlpStandard');
    query.where('nlpStandard.name = :name', { name: nlpStandard });
  }

  // filter by resource grade level
  if (gradeLevel) {
    query.leftJoin('resource.gradeLevel', 'gradeLevel');
    query.where('gradeLevel.name = :name', { name: gradeLevel });
  }

  // filter by resource subject
  if (subject) {
    query.leftJoin('resource.subject', 'subject');
    query.where('subject.name = :name', { name: subject });
  }

  // filter by resource topic
  if (topic) {
    query.leftJoin('resource.topic', 'topic');
    query.where('topic.topic = :name', { name: topic });
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
    null
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

}
