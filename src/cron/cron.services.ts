import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron , CronExpression} from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as Airtable from 'airtable';
import { removeEmojisFromArray } from 'src/lib/helper';
import { AssessmentType } from 'src/resources/entities/assessment-type.entity';
import { ClassRoomNeed } from 'src/resources/entities/classroom-needs.entity';
import { ContentLink } from 'src/resources/entities/content-link.entity';
import { ContentWarning } from 'src/resources/entities/content-warning.entity';
import { EvaluationPreference } from 'src/resources/entities/evaluation-preference.entity';
import { Format } from 'src/resources/entities/format.entity';
import { Grade } from 'src/resources/entities/grade-levels.entity';
import { Journalist } from 'src/resources/entities/journalist.entity';
import { NewsLiteracyTopic } from 'src/resources/entities/newliteracy-topic.entity';
import { NLNOTopNavigation } from 'src/resources/entities/nlno-top-navigation.entity';
import { NlpStandard } from 'src/resources/entities/nlp-standard.entity';
import { Prerequisite } from 'src/resources/entities/prerequisite.entity';
import { ResourceType } from 'src/resources/entities/resource-types.entity';
import { Resource } from 'src/resources/entities/resource.entity';
import { SubjectArea } from 'src/resources/entities/subject-areas.entity';
import { Connection, Repository } from 'typeorm';
import dataSource from 'typeorm-data-source';

@Injectable()
export class CronServices{
    private airtable: Airtable;
    private base: Airtable.Base;
    private readonly logger = new Logger(CronServices.name);

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
    ){
        this.airtable = new Airtable({ apiKey: process.env.AT_SECRET_API_TOKEN }),
        this.base = this.airtable.base(process.env.AT_BASE_ID);
    }



    @Cron(CronExpression.EVERY_10_SECONDS)//'* * * * * *'
    async handleCron() {

        let resourcesData = await this.base(process.env.AT_TABLE_ID).select({
            // fields: [
            // 'Content title',
            // // 'Content Description', //changed
            // 'Name of link', 
            // 'Link to content (1)', 
            // 'Name of link (2)' , 
            // 'Link to content (2)' , 
            // 'Link to description' , 
            // 'Resource type (NEW)' , 
            // 'NLNO top navigation' , 
            // // 'Format(s)' , //removed
            // 'Grade level/band' , 
            // 'Classroom needs', 
            // 'Subject areas' , 
            // 'NLP standards' , 
            // 'News literacy topics' , 
            // 'Content warnings',
            // '⌛ Estimated time to complete' , 
            // 'Evaluation preference' , 
            // 'Assessment types' , 
            // 'Prerequisites/related',
            // ]
        }).all()
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
      console.log("resourcesData: ",resourcesData)
      let Recources = resourcesData.map(record =>{return {id :record.id , ...record.fields} })
      const resourceCleanData = await removeEmojisFromArray(Recources);

      console.log("resourceCleanData: ",resourceCleanData)
      const resourceMapped = resourceCleanData.map(resource => {
          console.log("typeof NLP standards: ",typeof resource["NLP standards"])
          if(resource["NLP standards"] !== undefined){
              var [name, description] = resource["NLP standards"].length ? resource["NLP standards"].map(student => student.replace(/^"/, "").split(":").map((str) => str.trim())) : ""
          }
          const nlpStandard = [{ name, description: resource["NLP standards"] !== undefined ? resource["NLP standards"] : "" }];
          const linksToContent = [];
          const name1 = resource["Name of link"] ? resource["Name of link"]: ""
          const url1 = resource["Link to content (1)"] ? resource["Link to content (1)"]: ""
          linksToContent.push({name: name1, url: url1})
          const name2 = resource["Name of link (2)"] !== undefined ? resource["Name of link (2)"] : "" 
          const url2 = resource["Name of link"] !== undefined  ? resource["Link to content (2)"] : "" 
          linksToContent.push({name: name2, url: url2})
          return  {
            id: resource['id'],
            contentTitle: resource["Content title"].length ? resource["Content title"] : "",
            contentDescription: resource['"About" text']? resource['"About" text'] : "",
            estimatedTimeToComplete: resource[" Estimated time to complete"] ? resource[" Estimated time to complete"] : "", // added a space there intentionally because even if we remove the emoji there is a space there
            journalist: resource["Journalist(s) or SME"] && resource["Journalist(s) or SME"].length ? resource["Journalist(s) or SME"].split(",").map(name => ({ name })) : "",
            linksToContent: linksToContent,
            resourceType: resource["Resource type (NEW)"] ? resource["Resource type (NEW)"].map(name => ({ name })).filter(item => item !== 'N/A') : "",
            nlnoTopNavigation: resource["NLNO top navigation"] && resource["NLNO top navigation"].length ? resource["NLNO top navigation"].map(name => ({ name })) : "",
            classRoomNeed: resource["Classroom needs"] && resource["Classroom needs"].length ? resource["Classroom needs"].filter(classNeed => classNeed !== 'N/A') : "",
            subjectArea:resource["Subject areas"] && resource["Subject areas"].length ? resource["Subject areas"].map(name => name.trim()) : "",
            nlpStandard: resource["NLP standards"] && resource["NLP standards"].length ? nlpStandard : "",
            newsLiteracyTopic: resource["News literacy topics"] && resource["News literacy topics"].length ? resource["News literacy topics"].filter(nlp => nlp !== 'N/A') : "",
            contentWarning: resource["Content warnings"] && resource["Content warnings"].length ? resource["Content warnings"].filter(content => content !== 'N/A') : "",
            evaluationPreference: resource["Evaluation preference"] && resource["Evaluation preference"].length ? resource["Evaluation preference"].filter(evaluation => evaluation !=='N/A') : "",
            assessmentType: resource["Assessment types"] && resource["Assessment types"].length ? resource["Assessment types"].filter(item => item !== 'N/A') : "",
            prerequisite: resource["Prerequisites/related"] &&  resource["Prerequisites/related"].length ? resource["Prerequisites/related"] : "",
            gradeLevel: resource["Grade level/band"] && resource["Grade level/band"].length ? resource["Grade level/band"].filter(grade => grade !== 'N/A') : "",
          };
        });


      console.log("resourceMapped: ",resourceMapped)

      // const newResources = [];
      // for(let resource of resourceMapped){

      //   let newResource = await this.resourcesRepository.findOne({
      //     where: {
      //       contentTitle: resource.contentTitle,
      //       contentDescription: resource.contentDescription,
      //       estimatedTimeToComplete: resource.estimatedTimeToComplete
      //     } 
      //   })
      //   if(!newResource){
      //     newResource = this.resourcesRepository.create({
      //         contentTitle: resource.contentTitle,
      //         contentDescription: resource.contentDescription,
      //         estimatedTimeToComplete: resource.estimatedTimeToComplete
      //     })
      //   }
      //   console.log("newResource: ",newResource)
      //   console.log("resource.journalist: ",resource.journalist)

        
      //   // newResource.journalist =
      //   if((resource.journalist).length) {
      //     await this.checkRecordExistOrAddInEntity(this.journalistRepository,'Journalists' ,resource.journalist)
      //   }


      //   console.log("===========================================linksToContent: ",resource.linksToContent)
      //   if(resource.linksToContent){
      //     this.checkRecordExistOrAddInEntity(this.contentLinkRepository, 'ContentLinks' , resource.linksToContent )
      //   }
      //    //['name', 'url']
      //   // newResource.resourceType = await this.getOrCreateEntities(this.resourceTypeRepository, resource.resourceType, ['name'])
      //   // newResource.nlnoTopNavigation = await this.getOrCreateEntities(this.nlnoTopNavigationRepository, resource.nlnoTopNavigation, ['name'])

      //   // // this.checkRecordExistOrAddInEntity(this.formatRepository, resource.format, ['name'] )
      //   console.log("resource.gradeLevel: ",resource.gradeLevel)
      //   if(resource.gradeLevel){
      //     this.checkRecordExistOrAddInEntity(this.gradeRepository,'Grades' , resource.gradeLevel, ['name'])
      //   }
        

      //   // newResource.classRoomNeed = await this.getOrCreateEntities(this.classRoomNeedRepository, resource.classRoomNeed, ['name'])
      //   // newResource.prerequisite  = await this.getOrCreateEntities(this.prerequisiteRepository, resource.prerequisite, ['name'])
      //   // // this.checkRecordExistOrAddInEntity(this.nlpStandardRepository, resource.nlpStandard, ['name', 'description'])
      //   // newResource.newsLiteracyTopic = await this.getOrCreateEntities(this.newsLiteracyTopicRepository, resource.newsLiteracyTopic, ['name'])
      //   // newResource.evaluationPreference = await this.getOrCreateEntities(this.evaluationPreferenceRepository, resource.evaluationPreference, ['name'])

      //   // newResource.contentWarning = await this.getOrCreateEntities(this.contentWarningRepository, resource.contentWarning, ['name'])
      //   // newResource.assessmentType = await this.getOrCreateEntities(this.assessmentTypeRepository, resource.assessmentType, ['name'])

      //   newResources.push(newResource);

      // }
      // await queryRunner.manager.save(newResources);
      await queryRunner.commitTransaction();

    }
    catch(error){
      await queryRunner.rollbackTransaction();
      throw error;
    }
    finally{
      await queryRunner.release();
    }
        

        // for (const resource of resourceMapped) {
        //     await this.checkRecordExistOrAddInEntity(this.resourcesRepository , "Resource" , { contentTitle : resource.contentTitle , })
        // }

      this.logger.debug('Called when the current second is 10');
    }

    @Cron(CronExpression.EVERY_10_MINUTES) // "0 */10 * * * *"
    async runEveryTenthMinute(){
        // let resourcesData = await this.base(process.env.AT_TABLE_ID).select().all()
        this.logger.debug('Called when the current minute is 10');
    }

    async checkRecordExistOrAddInEntity(repository: any, entity: string, data: any , fields = [] ) {

      if (Array.isArray(data)) {
        // If data is an array, iterate over each item and check/add records
        // console.log("saasfasdasdas--------------------------data")
        const typeOfData = this.checkArrayType(data)

        console.log("typeOfData: ",typeOfData)

        for (const item of data) { //a
          let existingRecord = {};
          // console.log("item:=======: ", item);
          
          if(typeOfData === 3 && item?.trim()){ //array of strings
            console.log("array of string ")
            existingRecord = await repository.findOne({ 
              where: fields.reduce((acc, field) => {
                // console.log("===========>>>>>>>>>>>>",acc,field);
                acc[field] = field === 'name' ? item : item;
                return acc;
              }, {})
            })
            // console.log("array of String -----existingRecord------------------>>>>>>>>>>>>>>>>: ",existingRecord)
          }
          if(typeOfData === 2 &&  Object.keys(item).length > 0){  //array of Objects
            existingRecord = await repository.findOne({ where: item });
          }
          
          // console.log("existingRecord===========>>>>>>",existingRecord);
          
    
          if(typeOfData === 3 && (!(Object.keys(item).length > 0) || existingRecord === null)){ //array of strings
            const data = fields.reduce((acc, field) => {
              // console.log("acc-------------?????",acc) //object
              // console.log("item[field]: ",item[field])
              acc[field] = field === 'name' ? item : item;
              return acc;
            }, {});
            // console.log("data is made here: ",data)
            const newEntities = await repository.create(data);

            console.log('Record added successfully!' , newEntities);
          }
          if (!(Object.keys(item).length > 0) && typeOfData === 2 ) {


            await repository.create({ ...item });
            console.log('Record added successfully!');
          } else {
            console.log('Record already exists.');
          }
        }
      } else if (typeof data === 'string') {
        // If data is a single string, check/add a record for that single item
        const existingRecord = await repository.findOne({ entity, data });
    
        if (!existingRecord) {
          await repository.create( data );
          console.log('Record added successfully!');
        } else {
          console.log('Record already exists.');
        }
      } else {
        console.log('Invalid data format provided.');
      }
    }

    checkArrayType(arr){
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
        console.log("The array contains both objects and strings.");
        return 1;
      } else if (isArrayOfObjects) {
        console.log("The array contains only objects.");
        return 2;
      } else if (isArrayOfStrings) {
        console.log("The array contains only strings.");
        return 3;
      } else {
        console.log("The array is empty or does not contain objects or strings.");
        return 0;
      }
    }

    async getOrCreateEntities(repository, entities, fields) {
      const newEntities = [];
      for (const entity of entities) {
        let dbEntity = await repository.findOne({
          where: fields.reduce((acc, field) => {
            console.log("===========>>>>>>>>>>>>",acc,field);
            acc[field] = field === 'name' ? entity[field] : entity[field];
            return acc;
          }, {})
        });
        // console.log("data-----:",data)
        if (Object.keys(dbEntity).length > 0 ) {
          const data = fields.reduce((acc, field) => {
            acc[field] = field === 'name' ? entity[field] : entity[field];
            return acc;
          }, {});
          console.log("data-----:",data)
          dbEntity = repository.create(data);
            await repository.save(dbEntity);
            newEntities.push(dbEntity);
        }
       
      }
      return newEntities;
    }
      


}