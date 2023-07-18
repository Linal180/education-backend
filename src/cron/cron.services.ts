import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Airtable, { Base } from "airtable";
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { NotifyPayload } from "../util/interfaces";
import { AirtablePayloadList } from '../util/interfaces';
import { WebhookPayload } from '../util/interfaces'
import { Webhook } from '../util/interfaces';
import { fieldDescriptions } from '../util/constants/index'



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
    this.base = airtable.base(this.configService.get<string>('educatorBaseId'));
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

  // Function to replace field IDs with key names
  replaceFieldIds(data: any) {
    if (typeof data === "object") {
      if (Array.isArray(data)) {
        return data.map((item) => this.replaceFieldIds(item));
      } else {
        const replacedData: any = {};
        for (const key in data) {
          if (key in fieldDescriptions) {
            replacedData[fieldDescriptions[key]] = this.replaceFieldIds(data[key]);
          } else {
            replacedData[key] = this.replaceFieldIds(data[key]);
          }
        }
        return replacedData;
      }
    } else {
      return data;
    }
  }

  async listOfWebhooks(webhookId: string): Promise<Webhook | null> {
    try {

      const url = `${this.webHookBaseUrl}/${this.educatorBaseId}/webhooks`
      const listOfHooks = await axios.get(url, this.config)
      const payloads = listOfHooks.data.webhooks

      for (const webhook of payloads) {
        if (webhook.id === webhookId) {
          return webhook;
        }
      }
      return null;
    }
    catch (error) {
      console.log("error: ", error)
      return null;
    }
  }

  async getRecordById(recordId: string) {
    try {
      const record = await axios.get(`${this.getRecordBaseUrl}/${this.educatorBaseId}/${this.educatorTableId}/${recordId}`, this.config)
      if (record.data) {
        // console.log("here we get record:  ", record.data)
        return record.data;
      }
      return null;
    }
    catch (error) {
      console.log("getRecordById error: ", error)
      return null;
    }
  }

  async checkNewRecord(payload: NotifyPayload): Promise<any> {
    try {
      
      const webhookDetail = await this.listOfWebhooks(payload.webhook.id);
      console.log("webhookDetail --- checkNewRecord: ", webhookDetail)

      const url = `${this.webHookBaseUrl}/${payload.base.id}/webhooks/${payload.webhook.id}/payloads${webhookDetail ? `?cursor=${webhookDetail.cursorForNextPayload > 20 ?  webhookDetail.cursorForNextPayload - 20 : 0}` : ''}`
      console.log("this.webHookBaseUrl ---NEWLY ADD RECORD    ... ", url)
      const newAddRecords = await axios.get(url, this.config)

      const payloads: AirtablePayloadList[] = newAddRecords.data.payloads

      // Calculate the timestamp for 24 hours ago
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      // Filter payloads based on the timestamp
      const filteredPayloads: AirtablePayloadList[] = payloads.filter(
        (payload) => new Date(payload.timestamp) > twentyFourHoursAgo
      );


      const newResources = []
      if (payloads.length > 0) {
        const recordIds = []
        //fetch new records list
        for (let record of filteredPayloads) {
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



  async removeRecords(payload: NotifyPayload): Promise<string[]> {
    let removeRecordIds = []

    const webhookDetail = await this.listOfWebhooks(payload.webhook.id);
    console.log("webhookDetail: ", webhookDetail)

    const removeUrl = `${this.webHookBaseUrl}/${payload.base.id}/webhooks/${payload.webhook.id}/payloads${webhookDetail.cursorForNextPayload ? `?cursor=${webhookDetail.cursorForNextPayload  > 20 ?webhookDetail.cursorForNextPayload - 20 : 0}` : ''}`
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



  async updateRecords(payload: NotifyPayload): Promise<any> {

    try {
      const webhookDetail = await this.listOfWebhooks(payload.webhook.id);
      console.log("webhookDetail: ", webhookDetail)
      const url = `${this.webHookBaseUrl}/${payload.base.id}/webhooks/${payload.webhook.id}/payloads${webhookDetail ? `?cursor=${webhookDetail.cursorForNextPayload > 20 ? webhookDetail.cursorForNextPayload - 20 : 0}` : ''}`;
      console.log("updateurl: " , url)
      const updatedRecords = await axios.get(url, this.config)
     
      const payloads: WebhookPayload[] = updatedRecords.data.payloads
      const updatedCleanRecords: { [recordId: string]: object } = {};

      if (payloads) {
        payloads.forEach(payload => {
          const { changedTablesById } = payload;
          const tableIds = Object.keys(changedTablesById);

          tableIds.forEach(tableId => {
            const changedRecordsById = changedTablesById[tableId].changedRecordsById;
            const recordIds = Object.keys(changedRecordsById);

            recordIds.forEach(recordId => {
              const current = changedRecordsById[recordId].current;
              const cellValuesByFieldId = current.cellValuesByFieldId;

              if (!updatedCleanRecords[recordId]) {
                updatedCleanRecords[recordId] = {};
              }

              Object.keys(cellValuesByFieldId).forEach(fieldId => {
                const replacedFieldId = this.replaceFieldIds(fieldId);
                let replacedValue = this.replaceFieldIds(cellValuesByFieldId[fieldId]);

                if (Array.isArray(replacedValue)) {
                  // Convert the array-like structure to an array of objects
                  replacedValue = replacedValue.map(item => {
                    if (typeof item === "object" && item.hasOwnProperty("name")) {
                      return item.name;
                    }
                    return item;
                  });
                } else if (typeof replacedValue === "object" && replacedValue.hasOwnProperty("name")) {
                  // Extract the "name" property directly
                  replacedValue = replacedValue.name;
                }

                if (fieldDescriptions.hasOwnProperty(replacedFieldId)) {
                  const fieldName = fieldDescriptions[replacedFieldId];
                  updatedCleanRecords[recordId][fieldName] = replacedValue;
                }
              });
            });
          });
        });
      }

      // Merge recnSHoBmKy42xqAN properties into updatedCleanRecords
      let result = []
      let resourceRecord
      for (const recordId in updatedCleanRecords) {
        console.log("updatedCleanRecords : " , { ...updatedCleanRecords[recordId] });
        try{
          resourceRecord= await this.base('NLP content inventory').find(recordId)
        }
        catch(minor){
          console.log("eror in this resource inventory: ",minor)
        }
       
        console.log("resourceRecord : " , {...resourceRecord});

        console.log("resourceRecord 000000000000000000000000>>>>MMMMMMMMMM : " , resourceRecord.fields['Resource ID']);
        result.push({ "id": recordId, "Resource ID": resourceRecord.fields['Resource ID'] ? resourceRecord.fields['Resource ID'] :"" , ...updatedCleanRecords[recordId] })
      }

      console.log("updateRecords -> result : " , result);
      console.log("updatedCleanRecords-----------------------:", updatedCleanRecords);
      console.log("empty is going ---------------------: ", JSON.stringify(updatedCleanRecords));

      return result

    }
    catch (error) {
      console.log("update record webhookId: ", error)
      // throw new HttpException("update record webhookId", HttpStatus.BAD_REQUEST, error)
    }
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