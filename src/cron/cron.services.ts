import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import Airtable, { Base } from "airtable";
import { removeEmojisFromArray } from 'src/lib/helper';
import { Resource } from '../resources/entities/resource.entity';
import { DataSource, Repository } from 'typeorm';
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CronServices {
  // private airtable: Airtable;
  private base: Base;
  private config: AxiosRequestConfig;
  private readonly checkNewRecordsWebHookId: string;
  private readonly deletedRecordsWebHookId: string;
  private readonly webHookBaseUrl: string;
  private readonly getRecordBaseUrl: string;
  private readonly tableId: string;
  private readonly baseId: string;
  private readonly dataSource: DataSource

  constructor(
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {
    const airtable = new Airtable({ apiKey: this.configService.get<string>('personalToken')});
    this.base = airtable.base( this.configService.get<string>('baseId'));
    const headers = {Authorization: `Bearer ${ this.configService.get<string>('personalToken')}`,};
    const config: AxiosRequestConfig = {headers}
    this.config = config


    const checkNewRecordsWebHookId = `${this.configService.get<string>('addWebHookId')}`;
    const deletedRecordsWebHookId = `${this.configService.get<string>('removeWebHookId')}`;
    const webHookBaseUrl =this.configService.get<string>('webHookBaseUrl')
    const getRecordBaseUrl = this.configService.get<string>('getRecordBaseUrl')
    const tableId = this.configService.get<string>('tableId')
    this.baseId = this.configService.get<string>('baseId')

    this.tableId = tableId
    this.getRecordBaseUrl = getRecordBaseUrl
    this.webHookBaseUrl = webHookBaseUrl
    this.deletedRecordsWebHookId = deletedRecordsWebHookId
    this.checkNewRecordsWebHookId = checkNewRecordsWebHookId;
  }



  // @Cron(CronExpression.EVERY_10_SECONDS) // "0 */10 * * * *"
  async getAirtableWebhookPayload() {
    //new -recordId
    await this.checkNewRecord()
    //remover -- recordId
    await this.removeRecords()

  }

  async checkNewRecord() {
    try {
      console.log("this.webHookBaseUrl     ... ",this.webHookBaseUrl)

      const url = `${this.webHookBaseUrl}/${this.baseId}/webhooks/${this.checkNewRecordsWebHookId}/payloads`
      const result = await this.httpService.axiosRef.get(url, this.config)

      console.log("result: ", result.data.payloads)

      const payloads = result.data.payloads
      if (payloads.length > 0) {
        const recordIds = []
        for (let record of payloads) {
          // const { changedTablesById } = record

          const {
            changedTablesById: {
              [Object.keys(record.changedTablesById)[0]]: { createdRecordsById }
            }
          } = record;

          if(Object.keys(createdRecordsById)[0]){
            console.log("Object.keys(createdRecordsById)[0]:   ",Object.keys(createdRecordsById)[0])
            recordIds.push(Object.keys(createdRecordsById)[0])
          }
          // console.log("changedTablesById: ",createdRecordsById)
          // recordIds.push( Object.keys(changedTablesById) )
        }

        for(let recordId of recordIds){
          //getRecord
          try {
            console.log("this.getRecordBaseUrl: ",this.getRecordBaseUrl)
            const result = await this.httpService.axiosRef.get(`${this.getRecordBaseUrl}/${this.baseId}/${this.tableId}/${recordId}`, this.config)

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
            throw new Error(error)
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
        // console.log("records: ", this.getDestroyedRecordIds(record.changedTablesById))
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