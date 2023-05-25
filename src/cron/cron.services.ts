import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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
import { AxiosRequestConfig } from 'axios';
import dataSource from 'typeorm-data-source';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CronServices {
  private airtable: Airtable;
  private base: Airtable.Base;
  private config: AxiosRequestConfig;
  private readonly checkNewRecordsWebHookId: string;
  private readonly deletedRecordsWebHookId: string;
  private readonly webHookBaseUrl: string;
  private readonly getRecordBaseUrl: string;
  private readonly tableId: string;

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
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {
    this.airtable = new Airtable({ apiKey: this.configService.get<string>('personalToken')}),
    this.base = this.airtable.base( this.configService.get<string>('baseId'));
    const headers = {Authorization: `Bearer ${ this.configService.get<string>('personalToken')}`,};
    const config: AxiosRequestConfig = {headers}
    this.config = config

    const checkNewRecordsWebHookId = `${this.configService.get<string>('addWebHookId')}`;
    const deletedRecordsWebHookId = `${this.configService.get<string>('removeWebHookId')}`;
    const webHookBaseUrl =this.configService.get<string>('webHookBaseUrl')
    const getRecordBaseUrl = this.configService.get<string>('getRecordBaseUrl')
    const tableId = this.configService.get<string>('tableId')

    this.tableId = tableId
    this.getRecordBaseUrl = getRecordBaseUrl
    this.webHookBaseUrl = webHookBaseUrl
    this.deletedRecordsWebHookId = deletedRecordsWebHookId
    this.checkNewRecordsWebHookId = checkNewRecordsWebHookId;
  }

  async dumpAllRecordsOfAirtable() {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let resourcesData = await this.base(this.tableId).select({}).all()
      let Recources = resourcesData.map(record => { return { id: record.id, ...record.fields } })
      const resourceCleanData = removeEmojisFromArray(Recources);

      const resourceMapped = resourceCleanData.map(resource => {
        if (resource["NLP standards"] !== undefined) {
          var [name, description] = resource["NLP standards"].length ? resource["NLP standards"].map(student => student.replace(/^"/, "").split(":").map((str) => str.trim())) : ""
        }
        const nlpStandard = [{ name, description: resource["NLP standards"] !== undefined ? resource["NLP standards"] : "" }];
        const linksToContent = [];
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
          estimatedTimeToComplete: resource[" Estimated time to complete"] ? resource[" Estimated time to complete"] : "", // added a space there intentionally because even if we remove the emoji there is a space there
          journalist: resource["Journalist(s) or SME"] && resource["Journalist(s) or SME"].length ? resource["Journalist(s) or SME"].split(",").map(name => ({ name })) : "",
          linksToContent: linksToContent,
          resourceType: resource["Resource type (NEW)"] ? resource["Resource type (NEW)"].map(name => ({ name })).filter(item => item !== 'N/A') : "",
          nlnoTopNavigation: resource["NLNO top navigation"] && resource["NLNO top navigation"].length ? resource["NLNO top navigation"].map(name => ({ name })) : "",
          classRoomNeed: resource["Classroom needs"] && resource["Classroom needs"].length ? resource["Classroom needs"].filter(classNeed => classNeed !== 'N/A') : "",
          subjectArea: resource["Subject areas"] && resource["Subject areas"].length ? resource["Subject areas"].map(name => name.trim()) : "",
          nlpStandard: resource["NLP standards"] && resource["NLP standards"].length ? nlpStandard : "",
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
            contentTitle: resource.contentTitle,
            contentDescription: resource.contentDescription,
            estimatedTimeToComplete: resource.estimatedTimeToComplete
          })
        }


        newResource.journalist = []
        if ((resource.journalist).length) {
          newResource.journalist= await this.checkRecordExistOrAddInEntity(this.journalistRepository, resource.recordId, resource.journalist)
        }

        newResource.linksToContent = []
        if (resource.linksToContent) {
          newResource.linksToContent= await this.checkRecordExistOrAddInEntity(this.contentLinkRepository,  resource.recordId, resource.linksToContent)
        }

        newResource.resourceType = []
        if (resource.resourceType) {
          const result = await this.checkRecordExistOrAddInEntity(this.resourceTypeRepository,  resource.recordId, resource.resourceType, ['name'])
          newResource.resourceType = [...result];
        }

        newResource.nlnoTopNavigation = []
        if (resource.nlnoTopNavigation) {
          newResource.nlnoTopNavigation = await this.checkRecordExistOrAddInEntity(this.nlnoTopNavigationRepository, resource.recordId, resource.nlnoTopNavigation, ['name'])
        }

        newResource.gradeLevel = []
        if (resource.gradeLevel) {
          const result = await this.checkRecordExistOrAddInEntity(this.gradeRepository, resource.recordId, resource.gradeLevel, ['name'])
          newResource.gradeLevel = [...result];
        }

        newResource.subjectArea = []
        if (resource.subjectArea) {
          newResource.subjectArea = await this.checkRecordExistOrAddInEntity(this.subjectAreaRepository, resource.recordId, resource.subjectArea, ['name'])
        }

        newResource.classRoomNeed = []
        if (resource.classRoomNeed) {
          newResource.classRoomNeed = await this.checkRecordExistOrAddInEntity(this.classRoomNeedRepository,  resource.recordId, resource.classRoomNeed, ['name'])
        }

        newResource.prerequisite = []
        if (resource.prerequisite) {
          newResource.prerequisite = await this.checkRecordExistOrAddInEntity(this.prerequisiteRepository,  resource.recordId, resource.prerequisite, ['name'])
        }
        newResource.nlpStandard = []
        if (resource.nlpStandard) {
          newResource.nlpStandard = await this.checkRecordExistOrAddInEntity(this.nlpStandardRepository,  resource.recordId, resource.nlpStandard, ['name', 'description'])
        }

        newResource.newsLiteracyTopic = []
        if (resource.newsLiteracyTopic) {
          newResource.newsLiteracyTopic = await this.checkRecordExistOrAddInEntity(this.newsLiteracyTopicRepository,  resource.recordId, resource.newsLiteracyTopic, ['name'])
        }
        newResource.evaluationPreference = []
        if (resource.evaluationPreference) {
          newResource.evaluationPreference = await this.checkRecordExistOrAddInEntity(this.evaluationPreferenceRepository,  resource.recordId, resource.evaluationPreference, ['name'])
        }

        newResource.contentWarning = []
        if (resource.contentWarning) {
          newResource.contentWarning = await this.checkRecordExistOrAddInEntity(this.contentWarningRepository, resource.recordId, resource.contentWarning, ['name'])
        }
        newResource.assessmentType = []
        if (resource.assessmentType) {
          newResource.assessmentType = await this.checkRecordExistOrAddInEntity(this.assessmentTypeRepository,  resource.recordId, resource.assessmentType, ['name'])
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

  // @Cron(CronExpression.EVERY_10_SECONDS) // "0 */10 * * * *"
  async getAirtableWebhookPayload() {
    //new -recordId
    await this.checkNewRecord()
    //remover -- recordId
    await this.removeRecords()

  }

  async checkRecordExistOrAddInEntity(repository: any, recordId: string, data: any, fields = []) {

    if (Array.isArray(data)) {
      // If data is an array, iterate over each item and check/add records
      const typeOfData = this.checkArrayType(data)
      const result = []

      for (const item of data) {
        let existingRecord = null;
        if (typeOfData === 3 && (!(Object.keys(item).length > 0) || existingRecord === null)) { //array of strings

          const data = fields.reduce((acc, field) => {
            acc[field] = field === 'name' ? item : item;
            return acc;
          }, {});
          const newEntities = await repository.create({ ...data, recordId });
          await repository.save(newEntities);
          result.push(newEntities)
        }
        if ((!(Object.keys(item).length > 0) || existingRecord === null) && typeOfData === 2) {
          const newEntity = await repository.create({ ...item, recordId })
          await repository.save(newEntity);
          result.push(newEntity)
        } else {
          console.log('Record already exists.');
        }
      }
      return result
    } 
    else if (typeof data === 'string') {
      const existingRecord = await repository.findOne({ where: { recordId: recordId } });

      if (!existingRecord) {
        const document = fields.reduce((acc, field) => {
          acc[field] = field === 'name' ? data : data;
          return acc;
        }, {});
        const dbEntity = await repository.create({ ...document, recordId });
        await repository.save(dbEntity);
        return [dbEntity]
      } else {
        console.log('Record already exists.');
      }
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
      // console.log("The array contains both objects and strings.");
      return 1;
    } else if (isArrayOfObjects) {
      // console.log("The array contains only objects.");
      return 2;
    } else if (isArrayOfStrings) {
      // console.log("The array contains only strings.");
      return 3;
    } else {
      // console.log("The array is empty or does not contain objects or strings.");
      return 0;
    }
  }

  async checkNewRecord() {
    try {
      const url = `${this.webHookBaseUrl}/${this.checkNewRecordsWebHookId}/payloads`
      const result = await this.httpService.axiosRef.get(url, this.config)

      console.log("result: ", result.data.payloads)

      const payloads = result.data.payloads
      if (payloads.length > 0) {
        for (let record of payloads) {
          const { changedTablesById } = record
          const recordId = Object.keys(changedTablesById.tblgigCmS7C2iPCkm.createdRecordsById)[0]
         
          //getRecord
          try {
            const result = await this.httpService.axiosRef.get(`${this.getRecordBaseUrl}/${recordId}`, this.config)

            let { fields } = result.data
            if (Object.keys(fields).length > 0) {
              fields = removeEmojisFromArray([fields]);
           
              if (Object.keys(fields[0]).includes('"About" text' ) ||Object.keys(fields[0]).includes( "Content title" ) ||Object.keys(fields[0]).includes(' Estimated time to complete') ){
                const data = {}

                if (fields["Content title"]) {
                  data['contentTitle'] = fields["Content title"] ? fields["Content title"] : ''
                }

                if (fields['"About" text']) {
                  data['contentDescription'] = fields['"About" text'] ? fields['"About" text'] : ''
                }

                if(fields[' Estimated time to complete']){
                  data['estimatedTimeToComplete'] = fields[' Estimated time to complete'] ? fields[' Estimated time to complete'] : ''
                }

                let checkResource = await this.resourcesRepository.save({
                  recordId: recordId,
                  ...data
                })

                if (!checkResource) {
                  console.log("We need to create that Resource")
                }
              }
            }
          }
          catch (error) {
            
          }
        }
      }
    }
    catch (error) {
      console.log("New Record Webhook have some issue", error)
    }
  }

  async removeRecords() {
    let removeRecordIds = []
    const removeUrl = `${this.webHookBaseUrl}/${this.deletedRecordsWebHookId}/payloads`
    const removeResult = await this.httpService.axiosRef.get(removeUrl, this.config)
    if (removeResult.data.payloads.length) {
      //changedTablesById
      for (let record of removeResult.data.payloads) {
        //getDestroyedRecordIds
        console.log("records: ", this.getDestroyedRecordIds(record.changedTablesById))
        removeRecordIds.push(this.getDestroyedRecordIds(record.changedTablesById))
      }
    }
  }

  getDestroyedRecordIds(data: object): string {
    const tableIds = Object.keys(data);
    const destroyedRecordIds: string[] = [];

    tableIds.forEach(tableId => {
      const tableData = data[tableId];
      const { destroyedRecordIds: recordIds } = tableData;
      destroyedRecordIds.push(...recordIds);
    });

    return destroyedRecordIds[0];
  }

  // @Cron('0 0 */6 * *') // '0 0 */6 * *' Every 7th Day
  async refreshWebHooks() {
    try{
        //new Record WebHook refresh
        const url = `${this.webHookBaseUrl}/${this.checkNewRecordsWebHookId}/refresh`
        await this.httpService.axiosRef.post(url, this.config)
          .then(
            (data) => {
              console.log("new record webhookId expire time refesh: ", data)
            }
          ).
          catch(error => { throw new HttpException("new record webhookId not refresh", HttpStatus.BAD_REQUEST, error) })

        //deleteWebHook
        const deletedRecordUrl = `${this.webHookBaseUrl}/${this.deletedRecordsWebHookId}/refresh`
        await this.httpService.axiosRef.post(deletedRecordUrl , this.config)
        .then(
          data => {
            console.log("new record webhookId expire time refesh: ", data)
          }
        )
        .catch(error => { throw new HttpException("new record webhookId not refresh", HttpStatus.BAD_REQUEST, error) })
    }
    catch(error){
      throw new HttpException('', HttpStatus.BAD_REQUEST , error)
    }



  }





}