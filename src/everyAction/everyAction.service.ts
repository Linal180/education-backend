import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplyActivistCodes } from 'src/users/dto/apply-activist-code.dto';
import { userEveryActionService } from 'src/userEveryActon/userEveryAction.service';

@Injectable()
export class EveryActionService {
  private apiUrl: string;
  private appName: string;
  private apiKey: string;
  private educatorActivistCode: string;
  private logger = new Logger('EveryActionService');

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,

    
    private organizationService: OrganizationsService,
  ) {
    this.apiUrl = configService.get<string>('everyAction.apiUrl');
    this.apiKey = configService.get<string>('everyAction.apiKey');
    this.appName = configService.get<string>('everyAction.appName');
    this.educatorActivistCode = configService.get<string>('everyAction.educatorActivistCodeId');
  }

  async send(user: User): Promise<any> {
    if (!this.apiUrl || !this.appName || !this.apiKey) {
      return;
    }

    let token = Buffer.from(`${this.appName}:${this.apiKey}`).toString('base64') || '';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`
    };

    this.logger.debug(`EAS: Start sending ${user.firstName} ${user.lastName} (${user.email}).`);

    const everyActionPayload: any = {};

    // add VAN ID if exists
    const vanId = await this.userService.getMeta(user , 'everyActionVanId')

    if (vanId) {
      everyActionPayload.vanId = vanId;
    }

    // add first name and last name
    everyActionPayload.firstName = user.firstName.substring(0, 20);
    everyActionPayload.lastName = user.lastName.substring(0, 25);

    // add email address
    if (user.email) {
      everyActionPayload.emails = [
        {
          email: user.email,
          type: 'W', // email is coded as work (W) for teachers or personal (P) otherwise
          isPreferred: true,
        },
      ];
    }

    // add employer and address of organization for teachers
    if (!!user.organization) {
      const organization = await this.organizationService.findOrganizationById(user.organization.id)

      everyActionPayload.employer = organization.name.substring(0, 50); // employer name; truncate to 50 chars per API spec
      everyActionPayload.addresses = [
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

    // declare custom contact fields array
    // these IDs are magic and were initially found in the API at endpoint /customFields
    everyActionPayload.customFieldValues = [
      // add platform custom contact field
      {
        customFieldId: 1670,
        customFieldGroupId: 348,
        assignedValue: 6, // assignedValue is the ID of a selection list item
      },
    ];

    // check for matching account on EveryAction
    // needed for custom contact addition
    // @see https://docs.everyaction.com/reference/people

    const findPayload: any = {};

    // if user has a VAN ID, search using VAN ID
    // if not, search using email
    if (vanId) {
      findPayload.vanId = vanId;
    } else {
      findPayload.firstName = user.firstName.substring(0, 20); // first name; truncate to 20 chars per API spec
      findPayload.lastName = user.lastName.substring(0, 25); // last name; truncate to 25 chars per API spec
      findPayload.emails = [{ email: user.email }];
    }

    // make request to /find endpoint to see if EveryAction already has user
    let findRes;
    try {
      findRes = await axios.post(`${this.apiUrl}/v4/people/find`, JSON.stringify(findPayload), { headers });
      
      if (findRes) {
        this.logger.debug(`Result status code: ${findRes.status}`);
        const match = [302, 200, 201, 204].includes(findRes.status);
        this.logger.debug(`Result body from Find request: ${JSON.stringify(findRes.data, null, 2)}\n\tvalue of vanId: ${vanId ? 'true' : 'false'}\n\tvalue of match: ${match ? 'true' : 'false'}`,
        );
      }
    } catch (error) {
      // fail gracefully, log it, assume no match, move on`
      user.log =  user.log +  `| Error making find request to EveryAction. Exception message: ${error.message}`
      await this.userService.updateById(user.id , {log : user.log})
    }

    // if we found a match and do not have a VAN ID for the user in our database,
    // update both that and the request payload to reflect new info
    // if found user does not have account creation date, add it to payload
    if (findRes && !vanId) {
      const foundUser = findRes.data;

      if (foundUser.vanId) {
        user.meta = await this.userService.setMeta(user.meta, { key: 'everyActionVanId', value: foundUser?.vanId });
        everyActionPayload.vanId = foundUser.vanId;
      }

      // get found users' details to see if the account creation date custom field has a value
      // if found user does not have account creation date, add it to payload
      if (foundUser.vanId) {
        try {
          const getRes = await axios.get(`${this.apiUrl}/v4/people/${foundUser.vanId}?$expand=customFields`, { headers });

          const foundUserDetails = getRes.data;
          const foundUserCustomFields = foundUserDetails.customFields;
          if (foundUserCustomFields) {
            for (const customField of foundUserCustomFields) {
              if (customField.customFieldId === 1671) {
                // account creation date custom field ID (magic number)
                if (!customField.assignedValue) {
                  // if account creation date is not set, add it to payload
                  everyActionPayload.customFieldValues.push({
                    customFieldId: 1671,
                    customFieldGroupId: 348,
                    assignedValue: user.createdAt ? user.createdAt.toString().split('T')[0] : new Date().toISOString().split('T')[0], // date formatting YYYY-MM-DD per API
                  });
                } else {
                  // if account creation date is set, store it on the user meta
                  user.meta = await this.userService.setMeta(user.meta, { key: 'everyActionAccountCreationDate', value: customField.assignedValue })

                  await this.userService.updateById( user.id , {meta : user.meta})
                }
              }
            }
          }
        } catch (error) {
          // fail gracefully, log it, assume no match, move on
          user.log = user.log + ` | Error making get request to EveryAction. Exception message: ${error.message} ${new Date()}  `
          await this.userService.updateById(user.id, { log: user.log })
        }
      } else {
        // if user not found, add account creation date to payload
        everyActionPayload.customFieldValues.push({
          customFieldId: 1671,
          customFieldGroupId: 348,
          assignedValue: user.createdAt ? user.createdAt.toString().split('T')[0] : new Date().toISOString().split('T')[0], // date formatting YYYY-MM-DD per API
        });
      }
    } else {
      // if no match, add account creation date custom contact field
      everyActionPayload.customFieldValues.push({
        customFieldId: 1671,
        customFieldGroupId: 348,
        assignedValue: user.createdAt ? user.createdAt.toString().split('T')[0] : new Date().toISOString().split('T')[0], // date formatting YYYY-MM-DD per API
      });
    }

    // add most recent login custom contact field
    if (user.lastLoginAt) {
      everyActionPayload.customFieldValues.push({
        customFieldId: 1908,
        customFieldGroupId: 348,
        assignedValue: user.lastLoginAt.toISOString().split('T')[0],
      });
    }
    // make request to EveryAction API with payload
    let res;

    try {
      res = await axios.post(`${this.apiUrl}/v4/people/findOrCreate`, JSON.stringify(everyActionPayload), { headers });
    } catch (error) {
      user.log = user.log + ` | Failed to create EveryAction resource. Exception Message: ${error.message} ${new Date()}  `
      await this.userService.updateById(user.id, { log: user.log })
      return;
    }

    if (![200, 201].includes(res.status)) {
      user.log = user.log + ` | Failed to create EveryAction resource. Status Code: ${res.status} ${new Date()}  `
      await this.userService.updateById(user.id, { log: user.log })
      return;
    }

    // save EveryAction VAN ID as metadata if not already saved
    const everyActionUser = res.data;
    if (everyActionUser && everyActionUser.vanId && !vanId) {
      
      const updatedMeta = await this.userService.setMeta(user.meta, { key: 'everyActionVanId', value: everyActionUser.vanId });

      await this.userService.updateById(user.id, { meta: updatedMeta });

      this.logger.debug(`EAS: Sent info to EveryAction API with response code ${res.status}`);
    }

  }

  async applyActivistCodes({ userId, grades, subjects }: ApplyActivistCodes): Promise<void> {
    if (!this.apiUrl || !this.appName || !this.apiKey || !this.educatorActivistCode) {
      console.log('Failed to apply EveryAction Activist Codes. Missing API URL, API key, app URL, or Activist Code ID(s).');
      return;
    }

    // get updated user record

    const user = await this.userService.findOneById(userId);

    if (!user) {
      console.log('Failed to apply EveryAction Activist Codes. Missing user information.');
      return;
    }

    const applicableActivistCodes = await this.getApplicableActivistCodes(user, { grades, subjects });

    console.log(`Applying Activist codes to ${user.fullName}.`, applicableActivistCodes);

    let token = Buffer.from(`${this.appName}:${this.apiKey}`).toString('base64') || '';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`
    };

    let vanId = await this.userService.getMeta(user, 'everyActionVanId', null);
    if (!vanId) {
      try {
        await this.send(user);
      } catch (error) {
        user.log = user.log + ` | Failed to apply EveryAction Activist Code after creating new EveryAction user. Exception message: ${error.message} ${new Date()}  `
        await this.userService.updateById(user.id, { log: user.log });
        return;
      }

      vanId = await this.userService.getMeta(user, 'everyActionVanId', null)
      if (!vanId) {   
        console.log('Failed to apply EveryAction Activist Code to user: No everyActionVanId.');
        return;
      }
    }

    const responses = applicableActivistCodes.map(activistCode => {
      return {
        activistCodeId: activistCode,
        action: 'Apply',
        type: 'ActivistCode',
      }
    });

    const everyActionPayload = {
      canvassContext: {
        dateCanvassed: new Date().toISOString(),
      },
      resultCodeId: null,
      responses: responses,
    };

    try {
      const response = await axios.post(`${this.apiUrl}/v4/people/${vanId}/canvassResponses`, JSON.stringify(everyActionPayload), { headers });

      if (response.status !== 204) {
        user.log = user.log + ` | Failed to apply EveryAction Activist Code(s) to user. Status Code: ${response.status} ${new Date()}  `
        await this.userService.updateById(user.id, { log: user.log });
        return;
      }

      // console.log(`Applied Activist Code ID(s) ${applicableActivistCodes} via EveryAction API with response code ${response.status}`);
    } catch (error) {
      user.log = user.log + ` | Failed to apply EveryAction Activist Code(s) to user. Exception message: ${error.message} ${new Date()}  `
      await this.userService.updateById(user.id, { log: user.log });
      return;
    }
  }

  async getApplicableActivistCodes(user: User, { grades, subjects }: Omit<ApplyActivistCodes, 'userId'>): Promise<string[]> {
    const applicableCodes = [this.educatorActivistCode];
    const {
      nlnOpt,
      siftOpt,
    } = user;

    if(nlnOpt) applicableCodes.push(this.configService.get<string>('everyAction.nlnInsiderActivistCode'))
    if(siftOpt) applicableCodes.push(this.configService.get<string>('everyAction.siftActivistCode'))

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
}

