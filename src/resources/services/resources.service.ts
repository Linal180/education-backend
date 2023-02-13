import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RESOURCES } from "src/users/auth/constants";
import { Connection, In, Repository } from "typeorm";
import { CreateResourceInput } from "../dto/resource-input.dto";
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
   * Creates resource service
   * @param createResourceInput 
   * @returns create 
   */
  async create(createResourceInput: CreateResourceInput): Promise<Resource> {
    const queryRunner = this.connection.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const newResource = this.resourcesRepository.create(createResourceInput);
      await manager.save(newResource);

      //Journalists
      const journalists = await this.journalistRepository.find({
        where: { name: In(createResourceInput.journalists) },
      });
      console.log("...journalists...",journalists);
      if(createResourceInput.journalists.length>0){
        console.log("createResourceInput.journalists",createResourceInput.journalists);
        const savedJournalists = await this.journalistRepository.save(createResourceInput.journalists);
        console.log("....savedJournalists..",savedJournalists);
        savedJournalists.forEach(journalist => {
          console.log("journalist",journalist);
          newResource.journalist = [...newResource.journalist, journalist];
        });
      }
     

      //LinksToContent
        // newResource.linksToContent = [...newResource.linksToContent];

      //ResourceType
      const resourceTypes = await this.resourceTypeRepository.find({
        where: { name: In(createResourceInput.resourceTypes) },
      });
      for (const resourceType of resourceTypes) {
        newResource.resourceType = [...newResource.resourceType, resourceType];
      }

      //NLNOTopNavigations
      const nlnoTopNavigations = await this.nlnoTopNavigationRepository.find({
        where: { name: In(createResourceInput.nlnoTopNavigations) },
      });
      for (const nlnoTopNavigation of nlnoTopNavigations) {
        newResource.nlnoTopNavigation = [...newResource.nlnoTopNavigation, nlnoTopNavigation];
      }

      //Formats
      const formats = await this.formatRepository.find({
        where: { name: In(createResourceInput.formats) },
      });
      for (const format of formats) {
        newResource.format = [...newResource.format, format];
      }

      //GradesLevels
      const grades = await this.gradeRepository.find({
        where: { name: In(createResourceInput.gradeLevels) },
      });
      for (const grade of grades) {
        newResource.gradeLevel = [...newResource.gradeLevel, grade];
      }

      //ClassRoomNeeds
      const classRoomNeeds = await this.classRoomNeedRepository.find({
        where: { name: In(createResourceInput.classRoomNeeds) },
      });
      for (const classRoomNeed of classRoomNeeds) {
        newResource.classRoomNeed = [...newResource.classRoomNeed, classRoomNeed];
      }

      //SubjectAreas
      const subjectAreas = await this.subjectAreaRepository.find({
        where: { name: In(createResourceInput.subjectAreas) },
      });
      for (const subjectArea of subjectAreas) {
        newResource.subjectArea = [...newResource.subjectArea, subjectArea];
      }

      //NLPStandards
      const nlpStandards = await this.nlpStandardRepository.find({
        where: { name: In(createResourceInput.nlpStandards) },
      });
      for (const nlpStandard of nlpStandards) {
        newResource.nlpStandard = [...newResource.nlpStandard, nlpStandard];
      }

      //NewsLiteracyTopics
      const newsLiteracyTopics = await this.newsLiteracyTopicRepository.find({
        where: { name: In(createResourceInput.newsLiteracyTopics) },
      });
      for (const newsLiteracyTopic of newsLiteracyTopics) {
        newResource.newsLiteracyTopic = [...newResource.newsLiteracyTopic, newsLiteracyTopic];
      }

      //ContentWarnings
      const contentWarnings = await this.contentWarningRepository.find({
        where: { name: In(createResourceInput.contentWarnings) },
      });
      for (const contentWarning of contentWarnings) {
        newResource.contentWarning = [...newResource.contentWarning, contentWarning];
      }
      
      //EvaluationPreferences
      const evaluationPreferences = await this.evaluationPreferenceRepository.find({
        where: { name: In(createResourceInput.evaluationPreferences) },
      });
      for (const evaluationPreference of evaluationPreferences) {
        newResource.evaluationPreference = [...newResource.evaluationPreference, evaluationPreference];
      }

      //AssessmentTypes
      const assessmentTypes = await this.assessmentTypeRepository.find({
        where: { name: In(createResourceInput.assessmentTypes) },
      });
      for (const assessmentType of assessmentTypes) {
        newResource.assessmentType = [...newResource.assessmentType, assessmentType];
      }

      //Prerequisites
      const prerequisites = await this.prerequisiteRepository.find({
        where: { name: In(createResourceInput.prerequisites) },
      });
      for (const prerequisite of prerequisites) {
        newResource.prerequisite = [...newResource.prerequisite, prerequisite];
      }

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
 * Updates resources service
 * @param updateResourceInput 
 * @returns update 
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
    await manager.save(resource);

    //Journalists
    if (updateResourceInput.journalists) {
      const journalists = await this.journalistRepository.find({
        where: { name: In(updateResourceInput.journalists) },
      });
      resource.journalist = journalists;
    }

    //LinksToContent
    if (updateResourceInput.linksToContents) {
      const links = updateResourceInput.linksToContents.map(link => {
        const newLink = new ContentLink();
        newLink.url = link.url;
        newLink.name = link.name;
        return newLink;
      });
      resource.linksToContent = links;
    }

    //ResourceType
    if (updateResourceInput.resourceTypes) {
      const resourceTypes = await this.resourceTypeRepository.find({
        where: { name: In(updateResourceInput.resourceTypes) },
      });
      resource.resourceType = resourceTypes;
    }

    //NLNOTopNavigations
    if (updateResourceInput.nlnoTopNavigations) {
      const nlnoTopNavigations = await this.nlnoTopNavigationRepository.find({
        where: { name: In(updateResourceInput.nlnoTopNavigations) },
      });
      resource.nlnoTopNavigation = nlnoTopNavigations;
    }

    //Formats
    if (updateResourceInput.formats) {
      const formats = await this.formatRepository.find({
        where: { name: In(updateResourceInput.formats) },
      });
      resource.format = formats;
    }

    //GradesLevels
    if (updateResourceInput.gradeLevels) {
      const grades = await this.gradeRepository.find({
        where: { name: In(updateResourceInput.gradeLevels) },
      });
      resource.gradeLevel = grades;
    }

    //ClassRoomNeeds
    if (updateResourceInput.classRoomNeeds) {
      const classRoomNeeds = await this.classRoomNeedRepository.find({
        where: { name: In(updateResourceInput.classRoomNeeds) },
      });
      resource.classRoomNeed = classRoomNeeds;
    }

    //SubjectAreas
    if (updateResourceInput.subjectAreas) {
      const subjectAreas = await this.subjectAreaRepository.find({
        where: { name: In(updateResourceInput.subjectAreas) },
      });
      resource.subjectArea = subjectAreas;
    }

    //NLPStandards
    if (updateResourceInput.nlpStandards) {
      const nlpStandards = await this.nlpStandardRepository.find({
        where: { name: In(updateResourceInput.nlpStandards) },
      });
      resource.nlpStandard = nlpStandards;
    }

    //NewsLiteracyTopics
    if (updateResourceInput.newsLiteracyTopics) {
      const newsLiteracyTopics = await this.newsLiteracyTopicRepository.find({
        where: { name: In(updateResourceInput.newsLiteracyTopics) },
      });
      resource.newsLiteracyTopic = newsLiteracyTopics;
    }

    //ContentWarnings
    if (updateResourceInput.contentWarnings) {
      const contentWarnings = await this.contentWarningRepository.find({
        where: { name: In(updateResourceInput.contentWarnings) },
      });
      resource.contentWarning = contentWarnings;
    }
    
    //EvaluationPreferences
    if (updateResourceInput.evaluationPreferences) {
      const evaluationPreferences = await this.evaluationPreferenceRepository.find({
        where: { name: In(updateResourceInput.evaluationPreferences) },
      });
      resource.evaluationPreference = evaluationPreferences;
    }

    //AssessmentTypes
    if (updateResourceInput.assessmentTypes) {
      const assessmentTypes = await this.assessmentTypeRepository.find({
        where: { name: In(updateResourceInput.assessmentTypes) },
      });
      resource.assessmentType = assessmentTypes;
    }

    //Prerequisites
    if (updateResourceInput.prerequisites) {
      const prerequisites = await this.prerequisiteRepository.find({
        where: { name: In(updateResourceInput.prerequisites) },
      });
      resource.prerequisite = prerequisites;
    }

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
async findOne(id: string) {
    // return await this.resourcesRepository.findOne({ where: { id } });
    const resource = RESOURCES.find(obj => obj.id === id);
    return {
      id: resource.id || "",
      contentTitle: resource["Content title"] || "",
      contentDescription: resource["Link to description"] || "",
      estimatedTimeToComplete: resource["⌛ Estimated time to complete"] || "",
      journalist: resource["Journalist(s) or SME"] || "",
      linksToContent: resource["Resource type"] || "",
      resourceType: resource["Resource type"] || "",
      nlnoTopNavigation: resource["NLNO top navigation"] || "",
      format: resource["Format(s)"] || "",
      gradeLevel: resource["Grade level"] || "",  
      classRoomNeed: resource["Classroom needs"] || "",
      subjectArea: resource["Subject areas"] || "",
      nlpStandard: resource["NLP standards"] || "",
      newsLiteracyTopic: resource["News literacy topics"] || "",
      contentWarning: resource["Content warnings"] || "",
      evaluationPreference: resource["Evaluation preference"] || "",
      assessmentType: resource["Assessment types"] || "",
      prerequisite: resource.Prerequisites || "",
    };
}

async find(offset: number, limit: number) {
  return RESOURCES.slice(offset, offset + limit).map(resource => ({
    id: resource.id || "",
    contentTitle: resource["Content title"] || "",
    contentDescription: resource["Link to description"] || "",
    estimatedTimeToComplete: resource["⌛ Estimated time to complete"] || "",
    journalist: resource["Journalist(s) or SME"] || "",
    linksToContent: resource["Resource type"] || "",
    resourceType: resource["Resource type"] || "",
    nlnoTopNavigation: resource["NLNO top navigation"] || "",
    format: resource["Format(s)"] || "",
    gradeLevel: resource["Grade level"] || "",  
    classRoomNeed: resource["Classroom needs"] || "",
    subjectArea: resource["Subject areas"] || "",
    nlpStandard: resource["NLP standards"] || "",
    newsLiteracyTopic: resource["News literacy topics"] || "",
    contentWarning: resource["Content warnings"] || "",
    evaluationPreference: resource["Evaluation preference"] || "",
    assessmentType: resource["Assessment types"] || "",
    prerequisite: resource.Prerequisites || "",
  }));
}

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
