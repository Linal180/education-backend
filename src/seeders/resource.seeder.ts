import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { AssessmentType } from '../AssessmentTypes/entities/assessment-type.entity';
import { ClassRoomNeed } from '../ClassRoomNeeds/entities/classroom-needs.entity';
import { ContentLink } from '../ContentLinks/entities/content-link.entity';
import { ContentWarning } from '../ContentWarnings/entities/content-warning.entity';
import { EvaluationPreference } from '../EvaluationPreferences/entities/evaluation-preference.entity';
import { Grade } from '../Grade/entities/grade-levels.entity';
import { Journalist } from '../Journalists/entities/journalist.entity';
import { NewsLiteracyTopic } from '../newLiteracyTopic/entities/newliteracy-topic.entity';
import { NLNOTopNavigation } from '../nlnoTopNavigation/entities/nlno-top-navigation.entity';
import { NlpStandard } from '../nlpStandards/entities/nlp-standard.entity';
import { Prerequisite } from '../Prerequisite/entities/prerequisite.entity';
import { ResourceType } from '../resources/entities/resource-types.entity';
import { Resource } from '../resources/entities/resource.entity';
import { SubjectArea } from '../subjectArea/entities/subject-areas.entity';
import { RESOURCES } from '../users/seeds/seed-data';

export default class ResourceSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); 
    try {
      const resourceRepository = dataSource.getRepository(Resource);
      //checking if database does not have any resources
      const resource = await resourceRepository.find();
      if(resource.length === 0){
        const resourceCleanData = await this.removeEmojisFromArray(RESOURCES);
      //mapping the data into insertion format 
        const resourceMapped = resourceCleanData.map(resource => {
        const [name, description] = resource["NLP standards"].replace(/^"/, "").split(":").map((str) => str.trim());
        const nlpStandard = [{ name, description: resource["NLP standards"] }];
        const linksToContent = [];
        const name1 = resource["Name of link"].length ? resource["Name of link"]: ""
        const url1 = resource["Link to content (1)"].length ? resource["Link to content (1)"]: ""
        linksToContent.push({name: name1, url: url1})
        const name2 = resource["Name of link (2)"].length ? resource["Name of link (2)"] : ""
        const url2 = resource["Link to content (2)"].length ? resource["Link to content (2)"]: ""
        linksToContent.push({name: name2, url: url2})
        return  {
          contentTitle: resource["Content title"].length ? resource["Content title"] : "",
          contentDescription: resource["About"].length ? resource["About"] : "",
          linkToDescription: resource["Link to description"].length ? resource["Link to description"] : "", 
          onlyOnCheckology: resource["Only on Checkology"].length &&  resource["Only on Checkology"] === 'checked' ? true : false, 
          createdAt: resource["Creation date"].length ? new Date(resource["Creation date"]) : new Date(), 
          updatedAt: resource["Date of last modification"].length ? new Date(resource["Date of last modification"]) : new Date(), 
          lastReviewDate: resource["Date of last review"].length ? new Date(resource["Date of last review"]) : new Date(), 
          featuredInSift: resource["Featured in the Sift"].length &&  resource["Featured in the Sift"] === 'checked' ? true : false, 
          estimatedTimeToComplete: resource["Estimated time to complete"].length ? resource["Estimated time to complete"] : "",
          journalist: resource["Journalist(s) or SME"] && resource["Journalist(s) or SME"].length ? resource["Journalist(s) or SME"].split(",").map(name => ({ name })) : [],
          linksToContent: linksToContent,
          resourceType: resource["Resource type (NEW)"].length ? resource["Resource type (NEW)"].split(",").map(name => ({ name })) : [],
          nlnoTopNavigation: resource["NLNO top navigation"].length ? resource["NLNO top navigation"].split(",").map(name => ({ name })) : [],
          // format: resource["Format(s)"].length ? resource["Format(s)"].split(",").map(name => ({ name })) : "",
          classRoomNeed: resource["Classroom needs"].length ? resource["Classroom needs"].split(",").map(name => ({ name })) : [],
          subjectArea: resource["Subject areas"].length ? resource["Subject areas"].split(",").map(name => ({ name: name.trim() })) : [],
          nlpStandard: resource["NLP standards"].length ? nlpStandard : "",
          newsLiteracyTopic: resource["News literacy topics"].length ? resource["News literacy topics"].split(",").map(name => ({ name })) : [],
          contentWarning: resource["Content warnings"].length ? resource["Content warnings"].split(",").map(name => ({ name })) : [],
          evaluationPreference: resource["Evaluation preference"].length ? resource["Evaluation preference"].split(",").map(name => ({ name })) : [],
          assessmentType: resource["Assessment types"].length ? resource["Assessment types"].split(",").map(name => ({ name })) : [],
          // prerequisite: resource["Prerequisites/related"].length ? resource["Prerequisites/related"].split(",").map(name => ({ name })) : [],
          gradeLevel: resource["Grade level/band"].length ? resource["Grade level/band"].split(",").map(name => ({ name })) : [],
        };
      });
      //initializing the resource related entities- repositories
      const journalistRepository = dataSource.getRepository(Journalist);
      const contentLinkRepository = dataSource.getRepository(ContentLink);
      const resourceTypeRepository = dataSource.getRepository(ResourceType);
      const nlnoTopNavigationRepository = dataSource.getRepository(NLNOTopNavigation);
      // const formatRepository = dataSource.getRepository(Format);
      const gradeRepository = dataSource.getRepository(Grade);
      const classRoomNeedRepository = dataSource.getRepository(ClassRoomNeed);
      const subjectAreaRepository = dataSource.getRepository(SubjectArea);
      const prerequisiteRepository = dataSource.getRepository(Prerequisite);
      const nlpStandardRepository = dataSource.getRepository(NlpStandard);
      const newsLiteracyTopicRepository = dataSource.getRepository(NewsLiteracyTopic);
      const evaluationPreferenceRepository = dataSource.getRepository(EvaluationPreference);
      const contentWarningRepository = dataSource.getRepository(ContentWarning);
      const assessmentTypeRepository = dataSource.getRepository(AssessmentType);
      const newResources = [];
      for (const resource of resourceMapped) {
        const newResource = resourceRepository.create({
          contentTitle: resource.contentTitle,
          // contentTitle_tsvector: await this.formatTsVector(resource.contentTitle),
          estimatedTimeToComplete: resource.estimatedTimeToComplete,
          contentDescription: resource.contentDescription,
          linkToDescription: resource.linkToDescription,
          onlyOnCheckology: resource.onlyOnCheckology,  
          featuredInSift: resource.featuredInSift,
          createdAt: resource.createdAt,
          updatedAt: resource.updatedAt,
          lastReviewDate: resource.lastReviewDate
        });

        newResource.journalist = await this.getOrCreateEntities(journalistRepository, resource.journalist, ['name']);
        newResource.linksToContent = await this.getOrCreateEntities(contentLinkRepository, resource.linksToContent, ['name', 'url']);
        newResource.resourceType = await this.getOrCreateEntities(resourceTypeRepository, resource.resourceType, ['name']);
        newResource.nlnoTopNavigation = await this.getOrCreateEntities(nlnoTopNavigationRepository, resource.nlnoTopNavigation, ['name']);
        // newResource.format = await this.getOrCreateEntities(formatRepository, resource.format, ['name']);
        newResource.gradeLevel = await this.getOrCreateEntities(gradeRepository, resource.gradeLevel, ['name']);
        newResource.classRoomNeed = await this.getOrCreateEntities(classRoomNeedRepository, resource.classRoomNeed, ['name']);
        newResource.subjectArea = await this.getOrCreateEntities(subjectAreaRepository, resource.subjectArea, ['name']);
        // newResource.prerequisite = await this.getOrCreateEntities(prerequisiteRepository, resource.prerequisite, ['name']);
        newResource.nlpStandard = await this.getOrCreateEntities(nlpStandardRepository, resource.nlpStandard, ['name', 'description']);
        newResource.newsLiteracyTopic = await this.getOrCreateEntities(newsLiteracyTopicRepository, resource.newsLiteracyTopic, ['name']);
        newResource.evaluationPreference = await this.getOrCreateEntities(evaluationPreferenceRepository, resource.evaluationPreference, ['name']);
        newResource.contentWarning = await this.getOrCreateEntities(contentWarningRepository, resource.contentWarning, ['name']);
        newResource.assessmentType = await this.getOrCreateEntities(assessmentTypeRepository, resource.assessmentType, ['name']);
        
        newResources.push(newResource);
      }
      await queryRunner.manager.save(newResources);
      await queryRunner.commitTransaction();
    }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  
  }
  async removeEmojisFromArray(array) {
    const regex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\n|[^\x00-\x7F]/g;
    const cleanArray = array.map(obj => {
      const newObj = {};
      for (let key in obj) {
        newObj[key.replace(regex, '')] = obj[key].replace(regex, '').trim();
      }
      return newObj;
    });
    return cleanArray;
  }
  
  async getOrCreateEntities(repository, entities, fields) {
    const newEntities = [];
    for (const entity of entities) {
      let dbEntity = await repository.findOne({
        where: fields.reduce((acc, field) => {
          acc[field] = field === 'name' ? entity[field] : entity[field];
          return acc;
        }, {})
      });
      if (!dbEntity) {
        const data = fields.reduce((acc, field) => {
          acc[field] = field === 'name' ? entity[field] : entity[field];
          return acc;
        }, {});
        dbEntity = repository.create(data);
          await repository.save(dbEntity);
      }
      newEntities.push(dbEntity);
    }
    return newEntities;
  }

  async formatTsVector(text) {
    // Convert text to lowercase and replace any non-alphanumeric characters with spaces
    const cleanedText = text.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
    // Replace spaces with ' & ' to create a tsvector
    const tsVector = `to_tsvector('english', '${cleanedText.replace(/\s+/g, ' & ')}')`;
    return tsVector;
  }

  async formatLinkToContent(resource){
    const linksToContent = [];
    const name = resource["Link to content"].length ? resource["Link to content"].split(",").map(name => ({ name: name })) : ""
    const url = resource["Link to content (1)"].length ? resource["Link to content (1)"].split(",").map(name => ({ url: name.trim() })) : ""
    linksToContent.push({name, url})
    const name2 = resource["Link to content"].length ? resource["Link to content"].split(",").map(name => ({ name: name })) : ""
    const url2 = resource["Link to content (1)"].length ? resource["Link to content (1)"].split(",").map(name => ({ url: name.trim() })) : ""
    linksToContent.push({name2, url2})
    return linksToContent;
  }
  
}