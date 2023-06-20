import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Airtable, { Base } from "airtable";
import { DataSource } from 'typeorm';
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
  private readonly educatorBaseId: string;
  private readonly educatorTableId: string;
  private readonly dataSource: DataSource;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {
    const airtable = new Airtable({ apiKey: this.configService.get<string>('personalToken') });
    this.base = airtable.base(this.configService.get<string>('baseId'));
    const headers = { Authorization: `Bearer ${this.configService.get<string>('personalToken')}`, };
    const config: AxiosRequestConfig = { headers }
    this.config = config


    const checkNewRecordsWebHookId = `${this.configService.get<string>('addWebHookId')}`;
    const updateNewRecordsWebHookId = `${this.configService.get<string>('updateWebHookId')}`
    const deletedRecordsWebHookId = `${this.configService.get<string>('removeWebHookId')}`;
    const webHookBaseUrl = this.configService.get<string>('webHookBaseUrl')

    const getRecordBaseUrl = this.configService.get<string>('getRecordBaseUrl')
    const tableId = this.configService.get<string>('tableId')
    this.baseId = this.configService.get<string>('baseId')
    this.educatorBaseId = this.configService.get<string>('educatorBaseId')
    this.educatorTableId = this.configService.get<string>('educatorTableId')

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

  async checkNewRecord(): Promise<any> {
    try {
      console.log("this.webHookBaseUrl     ... ", this.webHookBaseUrl)

      const url = `${this.webHookBaseUrl}/${this.educatorBaseId}/webhooks/${this.checkNewRecordsWebHookId}/payloads`
      const result = await this.httpService.axiosRef.get(url, this.config)

      console.log("result: ", result.data.payloads)

      const payloads = result.data.payloads
      const newResources = []
      if (payloads.length > 0) {
        const recordIds = []
        for (let record of payloads) {
          const { changedTablesById: { [Object.keys(record.changedTablesById)[0]]: { createdRecordsById } } } = record;

          if (Object.keys(createdRecordsById)[0]) {
            // console.log("Object.keys(createdRecordsById)[0]:   ",Object.keys(createdRecordsById)[0])
            recordIds.push(Object.keys(createdRecordsById)[0])
          }
        }

        for (let recordId of recordIds) {
          //getRecord
          try {
            // console.log("this.getRecordBaseUrl: ", this.getRecordBaseUrl)
            // console.log("recordId URL: ", `${this.getRecordBaseUrl}/${this.educatorBaseId}/${this.educatorTableId}/${recordId}`)
            const result = await this.httpService.axiosRef.get(`${this.getRecordBaseUrl}/${this.educatorBaseId}/${this.educatorTableId}/${recordId}`, this.config)

            let { fields, id } = result.data
            if (Object.keys(fields).length > 0) {
              // console.log(`Data for one Record: ${JSON.stringify(fields)}`)
              newResources.push({ id, ...fields })
            }
          }
          catch (error) {
            console.log("Record not Found while getting from airtable", error.message);
            // throw new Error(error)
          }
        }

        return newResources;
      }
    }
    catch (error) {
      console.log("New Record Webhook have some issue", error)
    }
  }

  async removeRecords(): Promise<string[]> {
    let removeRecordIds = []
    const removeUrl = `${this.webHookBaseUrl}/${this.educatorBaseId}/webhooks/${this.deletedRecordsWebHookId}/payloads`
    console.log("removeUrl is ", removeUrl)
    try {
      const removeResult = await this.httpService.axiosRef.get(removeUrl, this.config)
      if (removeResult.data.payloads.length) {
        //changedTablesById
        for (let record of removeResult.data.payloads) {
          removeRecordIds.push(this.getDestroyedRecordIds(record.changedTablesById))
        }
      }
      console.log("removed IDs from ", removeRecordIds)
      return removeRecordIds || [];
    }
    catch (error) {
      console.log("remove from airtable have issues", error)
    }

  }

  async updateRecords(): Promise<void> {
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
    //new Record WebHook refresh
    const url = `${this.webHookBaseUrl}/${this.checkNewRecordsWebHookId}/refresh`
    try{
      const newRecordRefresh = await this.httpService.axiosRef.post(url, this.config)
      if(newRecordRefresh.data){
        console.log("new record webhookId expire time refesh: ", newRecordRefresh.data)
      }
      else{
        console.log("new record webhookId expire time NOT refeshed!!!")
      }
    }
    catch (error) {
      throw new HttpException("new record webhookId not refresh", HttpStatus.BAD_REQUEST, error) 
    }        
    //deleteWebHook
    const deletedRecordUrl = `${this.webHookBaseUrl}/${this.deletedRecordsWebHookId}/refresh`
    try{
      const deleteRefresh =  await this.httpService.axiosRef.post(deletedRecordUrl , this.config)
      if(deleteRefresh.data){
        console.log("new record webhookId expire time refesh: ", deleteRefresh.data)
      }
    }
    catch(error){
      throw new HttpException("deleted record webhookId not refresh", HttpStatus.BAD_REQUEST, error)
    }
  }
}