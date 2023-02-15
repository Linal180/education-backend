import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { RESOURCES } from '../users/seeds/seed-data';
import { Resource } from '../resources/entities/resource.entity';
import { Journalist } from '../resources/entities/journalist.entity';
import { ContentLink } from '../resources/entities/content-link.entity';
import { ResourceType } from '../resources/entities/resource-types.entity';
import { NLNOTopNavigation } from '../resources/entities/nlno-top-navigation.entity';
import { Format } from '../resources/entities/format.entity';
import { Grade } from '../resources/entities/grade-levels.entity';
import { ClassRoomNeed } from '../resources/entities/classroom-needs.entity';
import { SubjectArea } from '../resources/entities/subject-areas.entity';
import { Prerequisite } from '../resources/entities/prerequisite.entity';
import { NewsLiteracyTopic } from '../resources/entities/newliteracy-topic.entity';
import { EvaluationPreference } from '../resources/entities/evaluation-preference.entity';
import { ContentWarning } from '../resources/entities/content-warning.entity';
import { AssessmentType } from '../resources/entities/assessement-type.entity';

export default class ResourceSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); 
    try {
      //mapping the data into insertion format 
      const resourceMapped = RESOURCES.map(resource => {
        return  {
          contentTitle: resource["Content title"] || "",
          contentDescription: resource["Link to description"] || "",
          estimatedTimeToComplete: resource["⌛ Estimated time to complete"] || "",
          journalist: resource["Journalist(s) or SME"].split(",").map(name => ({ name })) || "",
          linksToContent: resource["Link to content"].split(",").map(name => ({ name })) || "",
          resourceType: resource["Resource type"].split(",").map(name => ({ name })) || "",
          nlnoTopNavigation: resource["NLNO top navigation"].split(",").map(name => ({ name })) || "",
          format: resource["Format(s)"].split(",").map(name => ({ name })) || "",
          classRoomNeed: resource["Classroom needs"].split(",").map(name => ({ name })) || "",
          subjectArea: resource["Subject areas"].split(",").map(name => ({ name })) || "",
          nlpStandard: resource["NLP standards"].split(",").map(name => ({ name })) || "",
          newsLiteracyTopic: resource["News literacy topics"].split(",").map(name => ({ name })) || "",
          contentWarning: resource["Content warnings"].split(",").map(name => ({ name })) || "",
          evaluationPreference: resource["Evaluation preference"].split(",").map(name => ({ name })) || "",
          assessmentType: resource["Assessment types"].split(",").map(name => ({ name })) || "",
          prerequisite: resource["prerequisite"] && resource["prerequisite"]["related"] ? resource["prerequisite"]["related"].split(",").map(str => ({ name: str.trim() }))
          .reduce((acc, obj) => acc.some(o => o.name === obj.name) ? acc : [...acc, obj], []) : "",
          gradeLevel: resource["Grade level"] && resource["Grade level"]["band"] ? resource["Grade level"]["band"].split(",").map(str => ({ name: str.trim() }))
          .reduce((acc, obj) => acc.some(o => o.name === obj.name) ? acc : [...acc, obj], []) : "",
        };
      });
      // console.log("resourceMapped",resourceMapped);
      //initializing the resource related entities- repositories
      const resourceRepository = dataSource.getRepository(Resource);
      const journalistRepository = dataSource.getRepository(Journalist);
      const contentLinkRepository = dataSource.getRepository(ContentLink);
      const resourceTypeRepository = dataSource.getRepository(ResourceType);
      const nlnoTopNavigationRepository = dataSource.getRepository(NLNOTopNavigation);
      const formatRepository = dataSource.getRepository(Format);
      const gradeRepository = dataSource.getRepository(Grade);
      const classRoomNeedRepository = dataSource.getRepository(ClassRoomNeed);
      const subjectAreaRepository = dataSource.getRepository(SubjectArea);
      const prerequisiteRepository = dataSource.getRepository(Prerequisite);
      const nlpStandardRepository = dataSource.getRepository(Prerequisite);
      const newsLiteracyTopicRepository = dataSource.getRepository(NewsLiteracyTopic);
      const evaluationPreferenceRepository = dataSource.getRepository(EvaluationPreference);
      const contentWarningRepository = dataSource.getRepository(ContentWarning);
      const assessmentTypeRepository = dataSource.getRepository(AssessmentType);
      
      const newResources = [];
      for (const resource of resourceMapped) {
        // const newResource = resourceRepository.create(resource);
        const newResource = resourceRepository.create({
          contentTitle: resource.contentTitle,
          contentDescription: resource.contentDescription,
          estimatedTimeToComplete: resource.estimatedTimeToComplete
        });
        newResource.journalist = await this.getOrCreateEntities(journalistRepository, resource.journalist, ['name']);
        newResource.linksToContent = await this.getOrCreateEntities(contentLinkRepository, resource.linksToContent, ['name', 'url'], true);
        const resourceTypeMap = await this.getOrCreateEntities(resourceTypeRepository, resource.resourceType, ['name']);
        console.log("....resourceTypeMap...",resourceTypeMap);
        newResource.resourceType = await this.getOrCreateEntities(resourceTypeRepository, resource.resourceType, ['name']);
        newResource.nlnoTopNavigation = await this.getOrCreateEntities(nlnoTopNavigationRepository, resource.nlnoTopNavigation, ['name']);
        newResource.format = await this.getOrCreateEntities(formatRepository, resource.format, ['name']);
        newResource.gradeLevel = await this.getOrCreateEntities(gradeRepository, resource.gradeLevel, ['name']);
        newResource.classRoomNeed = await this.getOrCreateEntities(classRoomNeedRepository, resource.classRoomNeed, ['name']);
        newResource.subjectArea = await this.getOrCreateEntities(subjectAreaRepository, resource.subjectArea, ['name']);
        newResource.prerequisite = await this.getOrCreateEntities(prerequisiteRepository, resource.prerequisite, ['name']);
        newResource.nlpStandard = await this.getOrCreateEntities(nlpStandardRepository, resource.nlpStandard, ['name', 'description']);
        newResource.newsLiteracyTopic = await this.getOrCreateEntities(newsLiteracyTopicRepository, resource.newsLiteracyTopic, ['name']);
        newResource.evaluationPreference = await this.getOrCreateEntities(evaluationPreferenceRepository, resource.evaluationPreference, ['name']);
        newResource.contentWarning = await this.getOrCreateEntities(contentWarningRepository, resource.contentWarning, ['name']);
        newResource.assessmentType = await this.getOrCreateEntities(assessmentTypeRepository, resource.assessmentType, ['name']);

        console.log("....newResource...",newResource);
        
        newResources.push(newResource);
      }

      await queryRunner.manager.save(newResources);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  
  }

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
  
}