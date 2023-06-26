import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Airtable, { Base } from "airtable";
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';

interface AirtablePayloadList {
  timestamp?: string;
  baseTransactionNumber?: number;
  actionMetadata?: object;
  payloadFormat?: string;
  changedTablesById?: any;
  // Rest of the payload fields...
}

interface updatePayload {
  timestamp: string;
  baseTransactionNumber: number;
  actionMetadata: {
    source: string;
    sourceMetadata: {
      user: {
        id: string;
        email: string;
        permissionLevel: string;
        name: string;
        profilePicUrl: string;
      };
    };
  };
  payloadFormat: string;
  changedTablesById: {
    [tableId: string]: {
      changedRecordsById: {
        [recordId: string]: {
          current: {
            cellValuesByFieldId: {
              [fieldId: string]: string | object;
            };
          };
        };
      };
    };
  };
}


const fieldDescriptions: { [fieldId: string]: string } = {
  "fldc2H1I2fR2epttQ": "Content title",
  "fldp5HrDW01BJvIys": "Status",
  "fldFh8TdnGfxJYq7Z": "NewsLitNation exclusive",
  "fldydymQmqfb7HdVi": "Image group",
  "fldjWTjQgE1761RZ4": "Image status",
  "fld7Asnj9gVvJow3p": "About text",
  "fldzH355wem3gvLtH": "Link to transcript",
  "fldhvzjKHo8HNOWle": "Journalist(s) or SME",
  "fld7JSomwUvdSNQhG": "Journalist or SME organization(s)",
  "fldY46Ow5uDW3Pps8": "Resource type (USE THIS)",
  "fldgDOz9KEdlhx2zD": "Resource type (recent old)",
  "fldYr4Jy33afhKTDQ": "Resource type (OLD)",
  "fldEfvrENfLm25S0v": "Only on Checkology",
  "fldRY8vl0qJoHxdzf": "Featured in the Sift",
  "fld6E6qo7GZdfUivK": "Format(s)",
  "fldnjUbISnGXnW7bH": "Name of link",
  "fldiHSGvuHL7T4cyo": "Link to content",
  "fldbazwMCSp4Wkzck": "Link to description",
  "fldLj4JKv0Y4ZHQCc": "Grade level/band",
  "fldan0DTGvDYxqyn0": "Classroom needs",
  "fldVkNrDx2oFY3yHE": "Subject areas",
  "flduUiETVRowzuXRC": "NLP standards",
  "fldfib7Z6AbYPzZVm": "News literacy topics",
  "fldqMpIWZbKPt1r5K": "Content warnings",
  "fldSW0vx4jJPIQ9TZ": "Content warning to be added to content",
  "fld1kWksYAS780cmS": "Estimated time to complete",
  "fldiinCAfSTM2EQfI": "Links to standards alignments",
  "fldV4U0mo8X7K5Qb1": "Average completion times",
  "fldRW7FZAis07owoy": "Evaluation preference",
  "fldYjp4TJfsvWdwQT": "Assessment types",
  "fld1xTnOCK96cAyuQ": "Prerequisites/related",
  "fldB5xCe1m0ZStAYn": "Searchable tags",
  "fldpL1SOMG4aqRCgr": "Creation date",
  "fldXOdq6SxGFKNhvc": "Date of last review",
  "fldaVyIQftpTd1ETG": "Date of last modification",
  "fldEf0ryFsxsorsyS": "User feedback",
  "fldej912m9dZXWSbB": "Word wall terms",
  "fldP7FENBIw8q9hf1": "Word wall terms to link",
  "fldlC8TG35oDjOUBy": "Media outlets featured",
  "fld6JGcTaV6KjGpfg": "Media outlets mentioned",
  "fldk0Tb1w11BB8tb0": "Reporters and SMEs",
  "fldHmH0rrzjY5uav6": "Checkology overview page complete",
  "fld575A27H43puioA": "Learning objectives and essential questions",
  "fldbHra8LvCUeQ1sP": "NLNO top navigation",
  "fld9Hq3R7oEhGYcUq": "Field 35",
  "fldXlZOOdeZ9ohFAQ": "Why should it go dormant?",
  "fldRK2Cx0E46QP6Is": "Audit status",
  "fldhk2jBCzoCLjlvw": "Link to audit",
  "fldpD1WvPFLHVxRs7": "Checkology points",
  "fld2csHQtBnP780PP": "Link to content (2)",
  "fldcifY3oCktcHJad": "Name of link (2)",
  "fldYEUuvtphVjOFtV": "Field 49",
  "fld6Up2yd0WeFmlWe": "Standards alignments",
  "fldoTXibWopCbnFUH": "Primary image",
  "fldWYIQrR6BfbpC0Q": "Primary image alt text",
  "fldNpqcOpFFNX84tP": "Thumbnail image",
  "fldfg84Mj6LWErhUv": "Thumbnail image alt text",
  "fldPDx81qA8pVPiim": "Social image",
  "fldrRMJKampqxr02L": "Social image alt text"
};


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

  async checkNewRecord(): Promise<any> {
    try {
      console.log("this.webHookBaseUrl ---NEWLY ADD RECORD    ... ", `${this.webHookBaseUrl}/${this.educatorBaseId}/webhooks/${this.checkNewRecordsWebHookId}/payloads`)
      const url = `${this.webHookBaseUrl}/${this.educatorBaseId}/webhooks/${this.checkNewRecordsWebHookId}/payloads`
      const newAddRecords = await axios.get(url, this.config)
      console.log("newAddRecords: ", newAddRecords.data.payloads)
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

      const payloads: updatePayload[] = updatedRecords.data.payloads
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
      for (const recordId in updatedCleanRecords) {
        result.push({"id": recordId ,...updatedCleanRecords[recordId]}) 
      }
  

      console.log("updatedCleanRecords-----------------------:", updatedCleanRecords);
      console.log("empty is going ---------------------: ", JSON.stringify(updatedCleanRecords));

      return  result

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