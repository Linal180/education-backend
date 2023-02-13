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
      const newJournalists = [];
      for (const journalistName of createResourceInput.journalists) {
        let journalist = await this.journalistRepository.findOne({ where: {name: journalistName.name.toLowerCase()} });
        if (!journalist) {
          journalist = this.journalistRepository.create({ name: journalistName.name.toLowerCase() });
          await this.journalistRepository.save(journalist);
        }
        newJournalists.push(journalist);
      }
      newResource.journalist = newJournalists;
     

      //LinksToContent
      const linksToContents = [];
      for (const linksToContentName of createResourceInput.linksToContents) {
          let linksToContent = this.contentLinkRepository.create({ name: linksToContentName.name.toLowerCase(), url: linksToContentName.url });
          await this.contentLinkRepository.save(linksToContent);
          linksToContents.push(linksToContent);
      }
      newResource.linksToContent = linksToContents;

      //ResourceType
      const resourceTypes = [];
      for (const resourceTypeName of createResourceInput.resourceTypes) {
        let resourceType = await this.resourceTypeRepository.findOne({ where: {name: resourceTypeName.name.toLowerCase()} });
        if (!resourceType) {
          resourceType = this.resourceTypeRepository.create({ name: resourceTypeName.name.toLowerCase() });
          await this.resourceTypeRepository.save(resourceType);
        }
        resourceTypes.push(resourceType);
      }
      newResource.resourceType = resourceTypes;
     
      //NLNOTopNavigations
      const nlnoTopNavigations = [];
      for (const nlnoTopNavigationName of createResourceInput.nlnoTopNavigations) {
        let nlnoTopNavigation = await this.nlnoTopNavigationRepository.findOne({ where: {name: nlnoTopNavigationName.name.toLowerCase()} });
        if (!nlnoTopNavigation) {
          nlnoTopNavigation = this.nlnoTopNavigationRepository.create({ name: nlnoTopNavigationName.name.toLowerCase() });
          await this.nlnoTopNavigationRepository.save(nlnoTopNavigation);
        }
        nlnoTopNavigations.push(nlnoTopNavigation);
      }
      newResource.nlnoTopNavigation = nlnoTopNavigations;

      //Formats
      const formats = [];
      for (const formatName of createResourceInput.formats) {
        let format = await this.formatRepository.findOne({ where: {name: formatName.name.toLowerCase()} });
        if (!format) {
          format = this.formatRepository.create({ name: formatName.name.toLowerCase() });
          await this.formatRepository.save(format);
        }
        formats.push(format);
      }
      newResource.format = formats;

      //GradesLevels
      const grades = [];
      for (const gradeName of createResourceInput.gradeLevels) {
        let grade = await this.gradeRepository.findOne({ where: {name: gradeName.name.toLowerCase()} });
        if (!grade) {
          grade = this.gradeRepository.create({ name: gradeName.name.toLowerCase() });
          await this.gradeRepository.save(grade);
        }
        grades.push(grade);
      }
      newResource.gradeLevel = grades;

      //ClassRoomNeeds
      const classRoomNeeds = [];
      for (const classRoomNeedName of createResourceInput.classRoomNeeds) {
        let classRoomNeed = await this.classRoomNeedRepository.findOne({ where: {name: classRoomNeedName.name.toLowerCase()} });
        if (!classRoomNeed) {
          classRoomNeed = this.classRoomNeedRepository.create({ name: classRoomNeedName.name.toLowerCase() });
          await this.classRoomNeedRepository.save(classRoomNeed);
        }
        classRoomNeeds.push(classRoomNeed);
      }
      newResource.classRoomNeed = classRoomNeeds;

      //SubjectAreas
      const subjectAreas = [];
      for (const subjectAreaName of createResourceInput.subjectAreas) {
        let subjectArea = await this.subjectAreaRepository.findOne({ where: {name: subjectAreaName.name.toLowerCase()} });
        if (!subjectArea) {
          subjectArea = this.subjectAreaRepository.create({ name: subjectAreaName.name.toLowerCase() });
          await this.subjectAreaRepository.save(subjectArea);
        }
        subjectAreas.push(subjectArea);
      }
      newResource.subjectArea = subjectAreas;

      //NLPStandards
      const nlpStandards = [];
      for (const nlpStandardName of createResourceInput.nlpStandards) {
        let nlpStandard = await this.nlpStandardRepository.findOne({ where: {name: nlpStandardName.name.toLowerCase()} });
        if (!nlpStandard) {
          nlpStandard = this.nlpStandardRepository.create({ name: nlpStandardName.name.toLowerCase() });
          await this.nlpStandardRepository.save(nlpStandard);
        }
        nlpStandards.push(nlpStandard);
      }
      newResource.nlpStandard = nlpStandards;

      //NewsLiteracyTopics
      const newsLiteracyTopics = [];
      for (const newsLiteracyTopicName of createResourceInput.newsLiteracyTopics) {
        let newsLiteracyTopic = await this.newsLiteracyTopicRepository.findOne({ where: {name: newsLiteracyTopicName.name.toLowerCase()} });
        if (!newsLiteracyTopic) {
          newsLiteracyTopic = this.newsLiteracyTopicRepository.create({ name: newsLiteracyTopicName.name.toLowerCase() });
          await this.newsLiteracyTopicRepository.save(newsLiteracyTopic);
        }
        newsLiteracyTopics.push(newsLiteracyTopic);
      }
      newResource.newsLiteracyTopic = newsLiteracyTopics;

      //ContentWarnings
      const contentWarnings = [];
      for (const contentWarningName of createResourceInput.contentWarnings) {
        let contentWarning = await this.contentWarningRepository.findOne({ where: {name: contentWarningName.name.toLowerCase()} });
        if (!contentWarning) {
          contentWarning = this.contentWarningRepository.create({ name: contentWarningName.name.toLowerCase() });
          await this.contentWarningRepository.save(contentWarning);
        }
        contentWarnings.push(contentWarning);
      }
      newResource.contentWarning = contentWarnings;
      
      //EvaluationPreferences
      const evaluationPreferences = [];
      for (const evaluationPreferenceName of createResourceInput.evaluationPreferences) {
        let evaluationPreference = await this.evaluationPreferenceRepository.findOne({ where: {name: evaluationPreferenceName.name.toLowerCase()} });
        if (!evaluationPreference) {
          evaluationPreference = this.evaluationPreferenceRepository.create({ name: evaluationPreferenceName.name.toLowerCase() });
          await this.evaluationPreferenceRepository.save(evaluationPreference);
        }
        evaluationPreferences.push(evaluationPreference);
      }
      newResource.evaluationPreference = evaluationPreferences;

      //AssessmentTypes
      const assessmentTypes = [];
      for (const assessmentTypeName of createResourceInput.assessmentTypes) {
        let evaluationPreference = await this.assessmentTypeRepository.findOne({ where: {name: assessmentTypeName.name.toLowerCase()} });
        if (!evaluationPreference) {
          evaluationPreference = this.assessmentTypeRepository.create({ name: assessmentTypeName.name.toLowerCase() });
          await this.assessmentTypeRepository.save(evaluationPreference);
        }
        assessmentTypes.push(evaluationPreference);
      }
      newResource.assessmentType = assessmentTypes;

      //Prerequisites
      const prerequisites = [];
      for (const prerequisiteName of createResourceInput.prerequisites) {
        let prerequisite = await this.prerequisiteRepository.findOne({ where: {name: prerequisiteName.name.toLowerCase()} });
        if (!prerequisite) {
          prerequisite = this.prerequisiteRepository.create({ name: prerequisiteName.name.toLowerCase() });
          await this.prerequisiteRepository.save(prerequisite);
        }
        prerequisites.push(prerequisite);
      }
      newResource.prerequisite = prerequisites;

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

    const newJournalists = [];
    for (const journalistName of updateResourceInput.journalists) {
      let journalist = await this.journalistRepository.findOne({ where: {name: journalistName.name.toLowerCase()} });
      if (!journalist) {
        journalist = this.journalistRepository.create({ name: journalistName.name.toLowerCase() });
        await this.journalistRepository.save(journalist);
      }
      newJournalists.push(journalist);
    }
    resource.journalist = newJournalists;
   

    //LinksToContent
    const linksToContents = [];
    for (const linksToContentName of updateResourceInput.linksToContents) {
        let linksToContent = this.contentLinkRepository.create({ name: linksToContentName.name.toLowerCase(), url: linksToContentName.url });
        await this.contentLinkRepository.save(linksToContent);
        linksToContents.push(linksToContent);
    }
    resource.linksToContent = linksToContents;

    //ResourceType
    const resourceTypes = [];
    for (const resourceTypeName of updateResourceInput.resourceTypes) {
      let resourceType = await this.resourceTypeRepository.findOne({ where: {name: resourceTypeName.name.toLowerCase()} });
      if (!resourceType) {
        resourceType = this.resourceTypeRepository.create({ name: resourceTypeName.name.toLowerCase() });
        await this.resourceTypeRepository.save(resourceType);
      }
      resourceTypes.push(resourceType);
    }
    resource.resourceType = resourceTypes;
   
    //NLNOTopNavigations
    const nlnoTopNavigations = [];
    for (const nlnoTopNavigationName of updateResourceInput.nlnoTopNavigations) {
      let nlnoTopNavigation = await this.nlnoTopNavigationRepository.findOne({ where: {name: nlnoTopNavigationName.name.toLowerCase()} });
      if (!nlnoTopNavigation) {
        nlnoTopNavigation = this.nlnoTopNavigationRepository.create({ name: nlnoTopNavigationName.name.toLowerCase() });
        await this.nlnoTopNavigationRepository.save(nlnoTopNavigation);
      }
      nlnoTopNavigations.push(nlnoTopNavigation);
    }
    resource.nlnoTopNavigation = nlnoTopNavigations;

    //Formats
    const formats = [];
    for (const formatName of updateResourceInput.formats) {
      let format = await this.formatRepository.findOne({ where: {name: formatName.name.toLowerCase()} });
      if (!format) {
        format = this.formatRepository.create({ name: formatName.name.toLowerCase() });
        await this.formatRepository.save(format);
      }
      formats.push(format);
    }
    resource.format = formats;

    //GradesLevels
    const grades = [];
    for (const gradeName of updateResourceInput.gradeLevels) {
      let grade = await this.gradeRepository.findOne({ where: {name: gradeName.name.toLowerCase()} });
      if (!grade) {
        grade = this.gradeRepository.create({ name: gradeName.name.toLowerCase() });
        await this.gradeRepository.save(grade);
      }
      grades.push(grade);
    }
    resource.gradeLevel = grades;

    //ClassRoomNeeds
    const classRoomNeeds = [];
    for (const classRoomNeedName of updateResourceInput.classRoomNeeds) {
      let classRoomNeed = await this.classRoomNeedRepository.findOne({ where: {name: classRoomNeedName.name.toLowerCase()} });
      if (!classRoomNeed) {
        classRoomNeed = this.classRoomNeedRepository.create({ name: classRoomNeedName.name.toLowerCase() });
        await this.classRoomNeedRepository.save(classRoomNeed);
      }
      classRoomNeeds.push(classRoomNeed);
    }
    resource.classRoomNeed = classRoomNeeds;

    //SubjectAreas
    const subjectAreas = [];
    for (const subjectAreaName of updateResourceInput.subjectAreas) {
      let subjectArea = await this.subjectAreaRepository.findOne({ where: {name: subjectAreaName.name.toLowerCase()} });
      if (!subjectArea) {
        subjectArea = this.subjectAreaRepository.create({ name: subjectAreaName.name.toLowerCase() });
        await this.subjectAreaRepository.save(subjectArea);
      }
      subjectAreas.push(subjectArea);
    }
    resource.subjectArea = subjectAreas;

    //NLPStandards
    const nlpStandards = [];
    for (const nlpStandardName of updateResourceInput.nlpStandards) {
      let nlpStandard = await this.nlpStandardRepository.findOne({ where: {name: nlpStandardName.name.toLowerCase()} });
      if (!nlpStandard) {
        nlpStandard = this.nlpStandardRepository.create({ name: nlpStandardName.name.toLowerCase() });
        await this.nlpStandardRepository.save(nlpStandard);
      }
      nlpStandards.push(nlpStandard);
    }
    resource.nlpStandard = nlpStandards;

    //NewsLiteracyTopics
    const newsLiteracyTopics = [];
    for (const newsLiteracyTopicName of updateResourceInput.newsLiteracyTopics) {
      let newsLiteracyTopic = await this.newsLiteracyTopicRepository.findOne({ where: {name: newsLiteracyTopicName.name.toLowerCase()} });
      if (!newsLiteracyTopic) {
        newsLiteracyTopic = this.newsLiteracyTopicRepository.create({ name: newsLiteracyTopicName.name.toLowerCase() });
        await this.newsLiteracyTopicRepository.save(newsLiteracyTopic);
      }
      newsLiteracyTopics.push(newsLiteracyTopic);
    }
    resource.newsLiteracyTopic = newsLiteracyTopics;

    //ContentWarnings
    const contentWarnings = [];
    for (const contentWarningName of updateResourceInput.contentWarnings) {
      let contentWarning = await this.contentWarningRepository.findOne({ where: {name: contentWarningName.name.toLowerCase()} });
      if (!contentWarning) {
        contentWarning = this.contentWarningRepository.create({ name: contentWarningName.name.toLowerCase() });
        await this.contentWarningRepository.save(contentWarning);
      }
      contentWarnings.push(contentWarning);
    }
    resource.contentWarning = contentWarnings;
    
    //EvaluationPreferences
    const evaluationPreferences = [];
    for (const evaluationPreferenceName of updateResourceInput.evaluationPreferences) {
      let evaluationPreference = await this.evaluationPreferenceRepository.findOne({ where: {name: evaluationPreferenceName.name.toLowerCase()} });
      if (!evaluationPreference) {
        evaluationPreference = this.evaluationPreferenceRepository.create({ name: evaluationPreferenceName.name.toLowerCase() });
        await this.evaluationPreferenceRepository.save(evaluationPreference);
      }
      evaluationPreferences.push(evaluationPreference);
    }
    resource.evaluationPreference = evaluationPreferences;

    //AssessmentTypes
    const assessmentTypes = [];
    for (const assessmentTypeName of updateResourceInput.assessmentTypes) {
      let evaluationPreference = await this.assessmentTypeRepository.findOne({ where: {name: assessmentTypeName.name.toLowerCase()} });
      if (!evaluationPreference) {
        evaluationPreference = this.assessmentTypeRepository.create({ name: assessmentTypeName.name.toLowerCase() });
        await this.assessmentTypeRepository.save(evaluationPreference);
      }
      assessmentTypes.push(evaluationPreference);
    }
    resource.assessmentType = assessmentTypes;

    //Prerequisites
    const prerequisites = [];
    for (const prerequisiteName of updateResourceInput.prerequisites) {
      let prerequisite = await this.prerequisiteRepository.findOne({ where: {name: prerequisiteName.name.toLowerCase()} });
      if (!prerequisite) {
        prerequisite = this.prerequisiteRepository.create({ name: prerequisiteName.name.toLowerCase() });
        await this.prerequisiteRepository.save(prerequisite);
      }
      prerequisites.push(prerequisite);
    }
    resource.prerequisite = prerequisites;

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
