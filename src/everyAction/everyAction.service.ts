import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { User } from 'src/users/entities/user.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EveryActionService {
  private apiUrl: string;
  private appName: string;
  private apiKey: string;
  private logger = new Logger('EveryActionService');

  constructor(private httpService: HttpService, private configService: ConfigService) {
    const apiUrl = configService.get<string>('everyAction.apiUrl');
    const apiKey = configService.get<string>('everyAction.apiKey');
    const appName = configService.get<string>('everyAction.appName');
  }

  async send(user: User): Promise<void> {
    if (!this.apiUrl || !this.appName || !this.apiKey) {
      return;
    }

    this.logger.debug(`EAS: Start sending ${user.firstName} ${user.lastName} (${user.email}).`);

    const everyActionPayload: any = {};

    // add VAN ID if exists
    // const vanId = user.getMeta('everyActionVanId');
    const vanId = ''
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
          // type: user.isTeacher() ? 'W' : 'P', // email is coded as work for teachers or personal otherwise
          isPreferred: true,
        },
      ];
    }

    // add phone number
    // if (user.phone && user.phone.length === 10) {
    //   everyActionPayload.phones = [
    //     {
    //       phoneNumber: user.phone,
    //       isPreferred: true,
    //     },
    //   ];
    // }

    // add employer and address of organization for teachers
    // if (user.isTeacher()) {
    //   const organization = user.getOrganization();
    //   if (organization) {
    //     everyActionPayload.employer = organization.name.substring(0, 50); // employer name; truncate to 50 chars per API spec
    //     everyActionPayload.addresses = [
    //       {
    //         addressLine1: organization.address,
    //         addressLine2: organization.address_2,
    //         city: organization.city,
    //         stateOrProvince: organization.state,
    //         zipOrPostalCode: organization.physical_zip,
    //         countryCode: organization.country,
    //         type: 'Work',
    //       },
    //     ];
    //   }
    // }

    // add ZIP code for public users
    // if (user.isPublic() && user.userable.zip_code) {
    //   everyActionPayload.addresses = [
    //     {
    //       zipOrPostalCode: user.userable.zip_code,
    //       type: 'Home',
    //     },
    //   ];
    // }

    // declare custom contact fields array
    // these IDs are magic and were initially found in the API at endpoint /customFields
    everyActionPayload.customFieldValues = [
      // add platform custom contact field
      {
        customFieldId: 1670,
        customFieldGroupId: 348,
        // assignedValue: user.isTeacher() ? 6 : 7, // assignedValue is the ID of a selection list item
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

    this.logger.debug(`EAS: Preparing to send find request to EveryAction. Body: ${JSON.stringify(findPayload, null, 2)}`);

    // make request to /find endpoint to see if EveryAction already has user
    let findRes;
    try {
      const config: AxiosRequestConfig = {
        auth: {
          username: this.appName,
          password: this.apiKey,
        },
        data: findPayload,
      };
      findRes = await this.httpService.post(`${this.apiUrl}/v4/people/find`, null, config).toPromise();
      if (findRes) {
        this.logger.debug(`Result status code: ${findRes.status}`);
        const match = [302, 200, 201, 204].includes(findRes.status);
        this.logger.debug(
          `Result body from Find request: ${JSON.stringify(findRes.data, null, 2)}\n\tvalue of vanId: ${
            vanId ? 'true' : 'false'
          }\n\tvalue of match: ${match ? 'true' : 'false'}`,
        );
      }
    } catch (error) {
      // fail gracefully, log it, assume no match, move on
      this.logger.error(`Error making find request to EveryAction. Exception message: ${error.message}`);
    }

    // if we found a match and do not have a VAN ID for the user in our database,
    // update both that and the request payload to reflect new info
    // if found user does not have account creation date, add it to payload
    if (findRes && !vanId) {
      const foundUser = findRes.data;

      if (foundUser.vanId) {
        // user.setMeta('everyActionVanId', foundUser.vanId);
        everyActionPayload.vanId = foundUser.vanId;
      }

      // get found users' details to see if the account creation date custom field has a value
      // if found user does not have account creation date, add it to payload
      if (foundUser.vanId) {
        try {
          const config: AxiosRequestConfig = {
            auth: {
              username: this.appName,
              password: this.apiKey,
            },
          };
          const getRes = await this.httpService
            .get(`${this.apiUrl}/v4/people/${foundUser.vanId}?$expand=customFields`, config)
            .toPromise();

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
                  // user.setMeta('everyActionAccountCreationDate', customField.assignedValue);
                }
              }
            }
          }
        } catch (error) {
          // fail gracefully, log it, assume no match, move on
          this.logger.error(`Error making get request to EveryAction. Exception message: ${error.message}`);
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
    // if (user.last_login_at) {
    //   everyActionPayload.customFieldValues.push({
    //     customFieldId: 1908,
    //     customFieldGroupId: 348,
    //     // assignedValue: user.last_login_at.toISOString().split('T')[0],
    //   });
    // }

    this.logger.debug(`EAS: Preparing to send request to EveryAction. Body: ${JSON.stringify(everyActionPayload, null, 2)}`);

    // make request to EveryAction API with payload
    let res;
    try {
      const config: AxiosRequestConfig = {
        auth: {
          username: this.appName,
          password: this.apiKey,
        },
        data: everyActionPayload,
      };
      res = await this.httpService.post(`${this.apiUrl}/v4/people/findOrCreate`, null, config).toPromise();
    } catch (error) {
      throw new Error(error.message);
    }

    if (![200, 201].includes(res.status)) {
      throw new Error(`Failed to create EveryAction resource. Status Code: (${res.status})`);
    }

    // save EveryAction VAN ID as metadata if not already saved
    const everyActionUser = res.data;
    if (everyActionUser && everyActionUser.vanId && !vanId) {
      // user.setMeta('everyActionVanId', everyActionUser.vanId);
    }

    // log it to user
    this.logger.debug(`EAS: Sent info to EveryAction API with response code ${res.status}`);
    // user.saveLogMessage(`Sent info to EveryAction API with response code ${res.status}`);
  }
}

