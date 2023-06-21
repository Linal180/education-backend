import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Airtable, { Base } from "airtable";
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class CronServices {
  // private airtable: Airtable;
  private base: Base;
  private config: AxiosRequestConfig;
  private readonly checkNewRecordsWebHookId: string;
  private readonly updateRecordsWebHookId: string;
  private readonly deletedRecordsWebHookId: string;
  private readonly webHookBaseUrl: string;
  private readonly getRecordBaseUrl: string;
  private readonly educatorBaseId: string;
  private readonly educatorTableId: string;


  constructor(
    private configService: ConfigService
  ) {
    const airtable = new Airtable({ apiKey: this.configService.get<string>('personalToken') });
    this.base = airtable.base(this.configService.get<string>('baseId'));
    const headers = { Authorization: `Bearer ${this.configService.get<string>('personalToken')}`, };
    const config: AxiosRequestConfig = { headers }
    this.config = config


    this.checkNewRecordsWebHookId = `${this.configService.get<string>('addWebHookId')}`;
    this.updateRecordsWebHookId = `${this.configService.get<string>('updateWebHookId')}`
    this.deletedRecordsWebHookId = `${this.configService.get<string>('removeWebHookId')}`;
    this.webHookBaseUrl = this.configService.get<string>('webHookBaseUrl')

    const getRecordBaseUrl = this.configService.get<string>('getRecordBaseUrl')
    this.educatorBaseId = this.configService.get<string>('educatorBaseId')
    this.educatorTableId = this.configService.get<string>('educatorTableId')

    this.getRecordBaseUrl = getRecordBaseUrl

  }

  async checkNewRecord(): Promise<any> {
    try {
      console.log("this.webHookBaseUrl ---NEWLY ADD RECORD    ... ", `${this.webHookBaseUrl}/${this.educatorBaseId}/webhooks/${this.checkNewRecordsWebHookId}/payloads`)
      const url = `${this.webHookBaseUrl}/${this.educatorBaseId}/webhooks/${this.checkNewRecordsWebHookId}/payloads`
      const newAddRecords = await axios.get(url, this.config)
      console.log("newAddRecords: ", newAddRecords.data.payloads)
      const payloads = newAddRecords.data.payloads
      const newResources = []
      if (payloads.length > 0) {
        const recordIds = []
        //fetch new records list
        for (let record of payloads) {
          const { changedTablesById: { [Object.keys(record.changedTablesById)[0]]: { createdRecordsById } } } = record;
          if (Object.keys(createdRecordsById)[0]) {
            recordIds.push(Object.keys(createdRecordsById)[0])
          }
        }

        for (let recordId of recordIds) {
          //getRecord
          try {
            const result = await axios.get(`${this.getRecordBaseUrl}/${this.educatorBaseId}/${this.educatorTableId}/${recordId}`, this.config)
            let { fields, id } = result.data
            if (Object.keys(fields).length > 0) {
              newResources.push({ id, ...fields })
            }
          }
          catch (error) {
            console.log("Record not Found while getting from airtable", error.message);
          }
        }
      }
      return newResources;
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
      const removeResult = await axios.get(removeUrl, this.config)
      if (removeResult.data.payloads.length) {
        //changedTablesById
        for (let record of removeResult.data.payloads) {
          removeRecordIds.push(this.getDestroyedRecordIds(record.changedTablesById))
        }
      }
      return removeRecordIds || [];
    }
    catch (error) {
      console.log("remove from airtable have issues", error)
    }

  }

  async updateRecords(): Promise<any> {

    try {
      const url = `${this.webHookBaseUrl}/${this.educatorBaseId}/webhooks/${this.updateRecordsWebHookId}/payloads`
      const updatedRecords = await axios.get(url, this.config)

      if (updatedRecords) {
        console.log("records updated: ", updatedRecords)
      }
      return updatedRecords

    }
    catch (error) {
      console.log("update record webhookId: ", error)
      // throw new HttpException("update record webhookId", HttpStatus.BAD_REQUEST, error)
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
    //new Record WebHook refresh
    const url = `${this.webHookBaseUrl}/${this.checkNewRecordsWebHookId}/refresh`
    try {
      const newRecordRefresh = await axios.post(url, this.config)
      if (newRecordRefresh.data) {
        console.log("new record webhookId expire time refesh: ", newRecordRefresh.data)
      }
      else {
        console.log("new record webhookId expire time NOT refeshed!!!")
      }
    }
    catch (error) {
      throw new HttpException("new record webhookId not refresh", HttpStatus.BAD_REQUEST, error)
    }
    //deleteWebHook
    const deletedRecordUrl = `${this.webHookBaseUrl}/${this.deletedRecordsWebHookId}/refresh`
    try {
      const deleteRefresh = await axios.post(deletedRecordUrl, this.config)
      if (deleteRefresh.data) {
        console.log("new record webhookId expire time refesh: ", deleteRefresh.data)
      }
    }
    catch (error) {
      throw new HttpException("deleted record webhookId not refresh", HttpStatus.BAD_REQUEST, error)
    }
  }
}