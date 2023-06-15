import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { User } from '../users/entities/user.entity';
import { OrganizationsService } from '../organizations/organizations.service';
import { ApplyActivistCodes } from '../users/dto/apply-activist-code.dto';
import { IEveryActionPayload, IEveryActionFindPayload, IEveryActionCustomField } from '../util/interfaces';
import { setMeta } from '../lib/helper';
import { getMeta } from '../lib/helper';
import { CUSTOM_FIELD_CONTACT_ID, CUSTOM_FIELD_GROUP_ID, CUSTOM_FIELD_LAST_LOGIN_ID, CREATION_DATE_FIELD_ID , VAN_ID_KEY_NAME } from '../util/constants';
import { EveryActionPayload } from './dto/everyaction-payload';

@Injectable()
export class EveryActionService {
  private apiUrl: string;
  private token: string;
  private appName: string;
  private apiKey: string;
  private educatorActivistCode: string;
  private everyActionPayload: IEveryActionPayload;
  private logger = new Logger('EveryActionService');
  private meta: Object;
  private userLog: string;

  constructor(
    private configService: ConfigService,
    private organizationService: OrganizationsService,
  ) {
    this.apiUrl = configService.get<string>('everyAction.apiUrl');
    this.apiKey = configService.get<string>('everyAction.apiKey');
    this.appName = configService.get<string>('everyAction.appName');
    this.educatorActivistCode = configService.get<string>('everyAction.educatorActivistCodeId');
    this.token = Buffer.from(`${this.appName}:${this.apiKey}`).toString('base64') || '';
    this.everyActionPayload = {};
    this.userLog = '';
    this.meta = {};
  }

  /**
   * Send newly created user to everyAction
   * @param user 
   * @returns 
   */
  async send(user: User): Promise<EveryActionPayload | null> {
    if(!this.validateEnvs()) return null;

    this.log(`EAS: Start sending ${user.firstName} ${user.lastName} (${user.email})`)

    // add VAN ID if exists
    const vanId = await getMeta(user, 'everyActionVanId')

    if (vanId) {
      this.everyActionPayload.vanId = vanId;
    }

    // add first name and last name
    this.everyActionPayload.firstName = user.firstName.substring(0, 20);
    this.everyActionPayload.lastName = user.lastName.substring(0, 25);

    // add email address
    if (user.email) {
      this.everyActionPayload.emails = [
        {
          email: user.email,
          type: 'W', // email is coded as work (W) for teachers or personal (P) otherwise
          isPreferred: true,
        },
      ];
    }

    // add employer and address of organization for teachers
    if (!!user.organization) {
      await this.addOrganizationInfo(user);
    }

    // declare custom contact fields array
    // these IDs are magic and were initially found in the API at endpoint /customFields
    this.everyActionPayload.customFieldValues = [
      // add platform custom contact field
      {
        customFieldId: CUSTOM_FIELD_CONTACT_ID,
        customFieldGroupId: CUSTOM_FIELD_GROUP_ID,
        assignedValue: 6, // assignedValue is the ID of a selection list item
      },
    ];

    // set everyAction user creaton field
    await this.setCreationDateField(user)

    // add most recent login custom contact field
    if (user.lastLoginAt) {
      this.everyActionPayload.customFieldValues.push({
        customFieldId: CUSTOM_FIELD_LAST_LOGIN_ID,
        customFieldGroupId: CUSTOM_FIELD_GROUP_ID,
        assignedValue: new Date(user.lastLoginAt).toISOString().split('T')[0],
      });
    }

    // make request to EveryAction API with payload
    try {
       const everyActionUser = await axios.post(`${this.apiUrl}/v4/people/findOrCreate`,
        this.everyActionPayload,
        { headers: this.headers() }
      );
       const { data } = everyActionUser
      if(data) {
        const { vanId } = data
        await this.updateUserMeta(user, { key: VAN_ID_KEY_NAME, value: vanId});
      }

      return { userLog: this.userLog, meta: this.meta };
    } 
    catch (error) {
      await this.addToUserLogs(`Failed to create EveryAction resource. Status Code: ${error.status}. Exception Message: ${error.message} ${new Date()}`);
      
      return { userLog: this.userLog };
    }
  }

  /**
   * 
   * @param ApplyActivistCodes
   * @returns void
   */
  async applyActivistCodes({ user, grades, subjects }: ApplyActivistCodes): Promise<void | object> {
    if(!this.validateEnvs("Failed to apply EveryAction Activist Codes. Missing API URL, API key, app URL.")){
      return;
    }
    
    if (!this.educatorActivistCode) {
      this.log("Failed to apply EveryAction Activist Codes. Missing Activist Code ID(s).");
      
      return;
    }

    const applicableActivistCodes = await this.getApplicableActivistCodes(user, { grades, subjects });

    this.log(`Applying Activist codes to ${user.fullName}. CODES >> ${applicableActivistCodes}`);
    let vanId = await getMeta(user, 'everyActionVanId');

    if (!vanId) {
      try {
        const { userLog, meta } = await this.send(user);
        if(Object.keys(meta).length){
          this.meta = {...this.meta, ...meta} 
        }
 
        this.userLog += userLog;
        
      } catch (error) {
        await this.addToUserLogs(`Failed to apply EveryAction Activist Code after creating new EveryAction user. Exception message: ${error.message} ${new Date()}`)
        return;
      }

      vanId = await getMeta(user, 'everyActionVanId')
      if (!vanId) {
        this.log("Failed to apply EveryAction Activist Code to user: No everyActionVanId");
        return;
      }
    }

    const everyActionPayload = await this.prepareActivistCodePayload(applicableActivistCodes)

    try {
      const response = await axios.post(`${this.apiUrl}/v4/people/${vanId}/canvassResponses`,
        JSON.stringify(everyActionPayload),
        { headers: this.headers() }
      );

      if (response.status !== 204) {
        await this.addToUserLogs(`Failed to apply EveryAction Activist Code(s) to user. Status Code: ${response.status} ${new Date()}`);
        return { userLog: this.userLog, meta: this.meta };
      }

      this.log(`Applied Activist Code ID(s) ${applicableActivistCodes} via EveryAction API with response code ${response.status}`)

    }
    catch (error) {
      await this.addToUserLogs(`Failed to apply EveryAction Activist Code(s) to user. Exception message: ${error.message} ${new Date()}`)
      return { userLog: this.userLog };
    }
    return { userLog: this.userLog, meta: this.meta };
  }

  /**
   * 
   * @param applicableActivistCodes 
   * @returns payload
   */
  private async prepareActivistCodePayload(applicableActivistCodes: string[]) {
    const responses = applicableActivistCodes.map(activistCode => {
      return {
        activistCodeId: activistCode,
        action: 'Apply',
        type: 'ActivistCode',
      }
    });

    return {
      canvassContext: {
        dateCanvassed: new Date().toISOString(),
      },
      resultCodeId: null,
      responses: responses,
    };
  }

  /**
   * 
   * @param user 
   * @param { grades, subjects }
   * @returns 
   */
  private async getApplicableActivistCodes(user: User, { grades, subjects }): Promise<string[]> {
    const applicableCodes = [this.educatorActivistCode];
    const { nlnOpt, siftOpt } = user;

    if (nlnOpt) applicableCodes.push(this.configService.get<string>('everyAction.nlnInsiderActivistCode'))
    if (siftOpt) applicableCodes.push(this.configService.get<string>('everyAction.siftActivistCode'))

    grades.map(grade => {
      switch (grade) {
        case "3-5":
          applicableCodes.push(this.configService.get<string>('everyAction.grade3To5ActivistCode'))
          break;

        case "6-8":
          applicableCodes.push(this.configService.get<string>('everyAction.grade6To8ActivistCode'))
          break;

        case "9-12":
          applicableCodes.push(this.configService.get<string>('everyAction.grade9To12ActivistCode'))
          break;

        case "Higher ed.":
          applicableCodes.push(this.configService.get<string>('everyAction.gradeHigherActivistCode'))
          break;

        default:
          applicableCodes.push(this.configService.get<string>('everyAction.gradeOtherActivistCode'))
          break;
      }
    });

    subjects.map(subject => {
      switch (subject) {
        case 'English language arts':
          applicableCodes.push(this.configService.get<string>('everyAction.subjectElaActivistCode'));
          break;

        case 'Social studies':
          applicableCodes.push(this.configService.get<string>('everyAction.subjectSocialStudiesActivistCode'));
          break;

        case 'Library/media studies':
          applicableCodes.push(this.configService.get<string>('everyAction.subjectLibraryAndMediaActivistCode'));
          break;

        case 'Journalism':
          applicableCodes.push(this.configService.get<string>('everyAction.subjectJournalismActivistCode'));
          break;

        case 'Arts':
          applicableCodes.push(this.configService.get<string>('everyAction.subjectArtsActivistCode'));
          break;

        case 'STEM':
          applicableCodes.push(this.configService.get<string>('everyAction.subjectStemActivistCode'));
          break;

        default:
          applicableCodes.push(this.configService.get<string>('everyAction.subjectOthersActivistCode'));
          break;
      }
    })

    return applicableCodes;
  }

  /**
   * 
   * @param vanId 
   * @param user 
   * @returns AxiosResponse
   */
  private async setCreationDateField(user: User): Promise<void> {
    // check for matching account on EveryAction
    // needed for custom contact addition
    // @see https://docs.everyaction.com/reference/people

    const findPayload: IEveryActionFindPayload = {};

    // if user has a VAN ID, search using VAN ID
    // if not, search using email
    if (this.everyActionPayload.vanId) {
      findPayload.vanId = this.everyActionPayload.vanId;
    } else {
      findPayload.firstName = user.firstName.substring(0, 20); // first name; truncate to 20 chars per API spec
      findPayload.lastName = user.lastName.substring(0, 25); // last name; truncate to 25 chars per API spec
      findPayload.emails = [{ email: user.email }];
    }

    // make request to /find endpoint to see if EveryAction already has user
    try {
      const findRes = await axios.post(`${this.apiUrl}/v4/people/find`,
        JSON.stringify(findPayload),
        { headers: this.headers() }
      );

      if (findRes) {
        this.log(`Result status code: ${findRes.status}`);
        const match = [302, 200, 201, 204].includes(findRes.status);
        this.log(`Result body from Find request: ${JSON.stringify(findRes.data, null, 2)}\n\tvalue of vanId: ${this.everyActionPayload.vanId ? 'true' : 'false'}\n\tvalue of match: ${match ? 'true' : 'false'}`);

        // if we found a match and do not have a VAN ID for the user in our database,
        // update both that and the request payload to reflect new info
        // if found user does not have account creation date, add it to payload
        if (!this.everyActionPayload.vanId) {
          const  everyActionUserFields =  await this.getEveryActionUserDetails(user, findRes.data)

          if(everyActionUserFields){
            for (const customField of everyActionUserFields) {
              if (customField.customFieldId === CREATION_DATE_FIELD_ID) {
                // account creation date custom field ID (magic number)
                if (!customField.assignedValue) {
                  // if account creation date is not set, add it to payload
                  this.everyActionPayload.customFieldValues.push(this.creationDateCustomField(user));
                } else {
                  // if account creation date is set, store it on the user meta
                  await this.updateUserMeta(user, { key: 'everyActionAccountCreationDate', value: String(customField.assignedValue) })
                }
              }
            }         
          }

        } else {
          // if no match, add account creation date custom contact field
          this.everyActionPayload.customFieldValues.push(this.creationDateCustomField(user));
        }
      }
    } catch (error) {
      this.log(`Error making find request to EveryAction. Exception message: ${error.message}`)

    }
  }

  private async getEveryActionUserDetails(user: User, foundUser: { vanId: string }): Promise<IEveryActionCustomField[] | null> {

    if (foundUser.vanId) {
      await this.updateUserMeta(user, { key: VAN_ID_KEY_NAME , value: foundUser?.vanId })
      this.everyActionPayload.vanId = foundUser.vanId;

      // get found users' details to see if the account creation date custom field has a value
      // if found user does not have account creation date, add it to payload
      try {
        const getRes = await axios.get(`${this.apiUrl}/v4/people/${foundUser.vanId}?$expand=customFields`, { headers: this.headers() });
        const { customFields } = getRes.data;
        // const foundUserCustomFields = foundUserDetails.customFields;
        return customFields ;
        
      } catch (error) {
        // fail gracefully, log it, assume no match, move on
        await this.addToUserLogs(`Error making get request to EveryAction. Exception message: ${error.message} ${new Date()}`)
        return null;
      }
    }
  }

  /**
   * return true
   */
  private validateEnvs(message?: string) {
    if (!this.apiUrl || !this.appName || !this.apiKey) {
      this.log(message ? message : 'Enviroments variables are to being set for EveryAction!')
      return false
    }
    return true
  }

  /**
   * 
   * @returns EveryAction header
   */
  private headers() {
    return {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Basic ${this.token}`
    };
  }

  private log(message: string) {
    this.logger.debug(`******* ${message} *******`);
  }

  private async addToUserLogs( message: string) {
    this.userLog += ` || ${message} `;
  }

  private async updateUserMeta(user: User, { key, value }: { key: string, value: string }): Promise<void> {
    user.meta = await setMeta(user.meta, { key, value });
    this.meta = JSON.parse(user.meta);
  }

  private creationDateCustomField(user: User) {
    return {
      customFieldId: CREATION_DATE_FIELD_ID,
      customFieldGroupId: CUSTOM_FIELD_GROUP_ID,
      assignedValue: user.createdAt
        ? new Date(user.createdAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0], // date formatting YYYY-MM-DD per API
    }
  }

  private async addOrganizationInfo(user: User): Promise<void> {
    const organization = await this.organizationService.findOrganizationById(user.organization.id)

    if (organization) {
      this.everyActionPayload.employer = organization.name.substring(0, 50) || ""; // employer name; truncate to 50 chars per API spec
      this.everyActionPayload.addresses = [
        {
          addressLine1: organization.street || '',
          addressLine2: organization.street || '',
          city: organization.city,
          zipOrPostalCode: organization.zip,
          stateOrProvince: organization.state,
          countryCode: user.country,
          type: 'Work',
        },
      ];
    }
  }
}
