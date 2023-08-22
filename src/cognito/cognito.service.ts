import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import {
  AdminDeleteUserCommandOutput, AdminUpdateUserAttributesCommandInput, AdminUpdateUserAttributesCommandOutput,
  CognitoIdentityProvider, GetUserCommandOutput, GlobalSignOutCommandOutput, InitiateAuthCommand,
  InitiateAuthCommandInput, SignUpCommandInput, SignUpCommandOutput, AdminCreateUserCommandOutput,
  AdminSetUserPasswordCommandInput, AdminInitiateAuthCommandInput, ListUsersCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../users/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserMeta } from 'src/users/dto/access-user.dto';
import { UtilsService } from 'src/util/utils.service';

@Injectable()
export class AwsCognitoService {
  private userPoolId: string;
  private client: CognitoIdentityProvider;
  private clientId: string;
  private clientSecret: string;
  private readonly jwtService: JwtService

  constructor(
    private configService: ConfigService,
    private utilService: UtilsService,
  ) {
    this.clientId = configService.get<string>('aws.clientId');
    this.userPoolId = configService.get<string>('aws.userPoolId');
    this.clientSecret = configService.get<string>('aws.clientSecret')

    this.client = new CognitoIdentityProvider({
      region: configService.get<string>('aws.region'),
      apiVersion: configService.get<string>('aws.version'),
      credentials: {
        accessKeyId: configService.get<string>('aws.key'),
        secretAccessKey: configService.get<string>('aws.secret'),
      }
    });
  }

  /**
   * 
   * @param username 
   * @param email 
   * @param password 
   * @returns SignUpCommandOutput
   */
  async createUser(
    username: string, email: string, password: string, meta: UserMeta
  ): Promise<SignUpCommandOutput & { Username: string }> {
    let awsUsername = username;
    let existingUser = await this.fetchUserWithUsername(awsUsername);
    const { country, first_name, last_name, organization, work_type, zip } = meta

    while (existingUser) {
      awsUsername += Math.floor(Math.random() * Math.pow(10, 1)).toString();
      existingUser = await this.fetchUserWithUsername(awsUsername);
    }

    const params: SignUpCommandInput = {
      ClientId: this.clientId,
      Username: awsUsername,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email.toLowerCase(),
        },
        {
          Name: 'custom:role',
          Value: UserRole.EDUCATOR,
        },
        {
          Name: 'custom:first_name',
          Value: first_name || '-',
        },
        {
          Name: 'custom:last_name',
          Value: last_name || '-',
        },
        {
          Name: 'custom:organization',
          Value: organization || '-',
        },
        {
          Name: 'custom:zip',
          Value: zip || '-',
        },
        {
          Name: 'custom:work_type',
          Value: work_type || '-',
        },
        {
          Name: 'custom:country',
          Value: this.utilService.getCountryKey(country) || '-',
        }
      ],

      ValidationData: [
        {
          Name: 'email',
          Value: email.toLowerCase(),
        },
      ],
      SecretHash: this.calculateSecretHash(awsUsername)
    };

    try {
      const response = await this.client.signUp(params);
      const { UserSub } = response;

      if (UserSub) {
        const updateStatusParams: AdminUpdateUserAttributesCommandInput = {
          UserPoolId: this.userPoolId,
          Username: username,
          UserAttributes: [
            {
              Name: 'email_verified',
              Value: 'true',
            }
          ],
        };

        await this.client.adminUpdateUserAttributes(updateStatusParams);
      }
      return { ...response, Username: awsUsername };
    } catch (error) {
      const { name, message } = error;

      if (name === 'UserLambdaValidationException') {
        const jsonStartIndex = message.indexOf('{');
        const jsonEndIndex = message.lastIndexOf('}') + 1;
        const jsonString = message.substring(jsonStartIndex, jsonEndIndex);

        return JSON.parse(jsonString);
      } else {
        console.log(error)
        throw new Error(error);

      }
    }
  }

  /**
   * 
   * @param username 
   * @param role 
   * @returns AdminUpdateUserAttributesCommandOutput
   */
  async updateUserRole(username: string, role: string): Promise<AdminUpdateUserAttributesCommandOutput> {
    // Construct the parameters for the adminUpdateUserAttributes method
    const params = {
      UserPoolId: this.userPoolId,
      Username: username,
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: role,
        },
      ],
    };

    try {
      // Call the adminUpdateUserAttributes method to update the user's role
      return await this.client.adminUpdateUserAttributes(params);
    } catch (error) {
      console.error('Failed to update user attributes:', error);
    }
  }

  /**
   * @description Delete cognito user
   * @param username 
   * @returns AdminDeleteUserCommandOutput
   */
  async deleteCognitoUser(username: string): Promise<AdminDeleteUserCommandOutput> {
    const params = {
      UserPoolId: this.userPoolId,
      Username: username,
    };

    try {
      return await this.client.adminDeleteUser(params);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }

  /**
   * @description Sign user out
   * @param accessToken 
   * @returns GlobalSignOutCommandOutput
   */
  async signOutUser(accessToken: string): Promise<GlobalSignOutCommandOutput> {
    const params = {
      AccessToken: accessToken,
    };

    try {
      return await this.client.globalSignOut(params);
    } catch (error) {
      console.error('Failed to sign out user:', error);
    }
  }

  /**
   * @description Initiate AWS auth
   * @param refreshToken 
   * @returns { accessToken: string }
   */
  async initiateAuth(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const result = await this.client.send(new InitiateAuthCommand({
        ClientId: this.clientId,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
          SECRET_HASH: this.clientSecret,
        },
      }));

      if (result.AuthenticationResult) {
        return {
          accessToken: result.AuthenticationResult.AccessToken,
        };
      } else {
        // Handle the authentication failure
        return null;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async resetPassword(username: string, password: string) {
    try {
      const updateParams: AdminSetUserPasswordCommandInput = {
        Password: password,
        UserPoolId: this.userPoolId,
        Username: username,
        Permanent: true,
      };

      await this.client.adminSetUserPassword(updateParams);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * @description 
   * @param awsUser 
   * @returns String
   */
  getAwsUserEmail(awsUser: AdminCreateUserCommandOutput): string {
    const emailAttribute = awsUser.User.Attributes.find((attribute) => attribute.Name === 'email');
    return emailAttribute ? emailAttribute.Value : '';
  }

  /**
   * 
   * @param awsUser 
   * @returns String
   */
  getAwsUserSub(awsUser: AdminCreateUserCommandOutput): string {
    const emailAttribute = awsUser.User.Attributes.find((attribute) => attribute.Name === 'sub');
    return emailAttribute ? emailAttribute.Value : '';
  }

  /**
   * 
   * @param awsUser 
   * @returns String
   */
  getAwsUserMetadata(
    awsUser: AdminCreateUserCommandOutput
  ) {
    const payload = {
      first_name: '',
      last_name: '',
      zip: '',
      work_type: '',
      organization: '',
      country: ''
    }

    awsUser.User.Attributes.map((attribute) => {
      switch (attribute.Name) {
        case 'custom:first_name':
          payload.first_name = attribute.Value;
          break;

        case 'custom:last_name':
          payload.last_name = attribute.Value;
          break;

        case 'custom:zip':
          payload.zip = attribute.Value;
          break;

        case 'custom:work_type':
          payload.work_type = attribute.Value;
          break;

        case 'custom:organization':
          payload.organization = attribute.Value;
          break;

        case 'custom:country':
          payload.country = attribute.Value;
          break;

      }
    });

    return payload;
  }

  /**
   * 
   * @param awsUser 
   * @returns String
   */
  getAwsUserRole(awsUser: AdminCreateUserCommandOutput): string {
    const role = awsUser.User.Attributes.find((attribute) => attribute.Name === 'custom:role');

    return role ? role.Value : '';
  }

  /**
   * 
   * @param user 
   * @param password 
   * @returns { accessToken: string; refreshToken: string }
   */
  async loginUser(user: User, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const secretHash = this.calculateSecretHash(user.username);

    const params: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: user.username,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };

    try {
      const response = await this.client.initiateAuth(params);

      const accessToken = response.AuthenticationResult?.AccessToken;
      const refreshToken = response.AuthenticationResult?.RefreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error('Email or password is not valid.');
      }

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error('Email or password is not valid.');
    }
  }

  /**
   * 
   * @param user 
   * @returns { accessToken: string; refreshToken: string }
   */
  async adminLoginUser(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const secretHash = this.calculateSecretHash(user.username);

    const params: AdminInitiateAuthCommandInput = {
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        USERNAME: user.username,
        PASSWORD: 'Admin@123',
        SECRET_HASH: secretHash,

      },
    };

    try {
      const response = await this.client.adminInitiateAuth(params);

      const accessToken = response.AuthenticationResult?.AccessToken;
      const refreshToken = response.AuthenticationResult?.RefreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error('User authentication failed.');
      }

      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error)
      throw new Error('User authentication failed.');
    }
  }

  /**
   * 
   * @param email 
   * @returns Cognito User
   */
  async fetchCognitoUserWithEmail(email: string) {
    const filter = `email = '${email}'`;

    return await this.fetchCognitoUsers(filter);
  }

  async fetchUserWithUsername(username: string, includeEmail = false) {
    const filter = `username = '${username}'`;

    return await this.fetchCognitoUsers(filter, !includeEmail);
  }

  /**
   * 
   * @param filter String
   * @returns Cognito User
   */
  async fetchCognitoUsers(filter: string, isUsername = false) {
    const attributes = isUsername
      ? ['sub', 'custom:role', 'custom:first_name', 'custom:last_name', 'custom:country']
      : ['sub', 'custom:role', 'email', 'custom:first_name', 'custom:last_name', 'custom:country'];
    const listUsersParams: ListUsersCommandInput = {
      'UserPoolId': this.userPoolId,
      'Filter': filter,
      'Limit': 1,
      'AttributesToGet': attributes,
    }

    try {
      const response = await this.client.listUsers(listUsersParams);
      const users = response.Users;

      return users.length ? users[0] : null;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * 
   * @param username 
   * @returns String Hash
   */
  calculateSecretHash(username: string): string {
    const message = username + this.clientId;
    const hash = crypto.createHmac('SHA256', this.clientSecret).update(message).digest('base64');
    return hash;
  }

  /**
   * @param accessToken
   * @returns 
   */
  async getDecodedCognitoUser(accessToken: string) {
    try {
      const user = await this.client.getUser({ AccessToken: accessToken });

      return user;
    } catch (error) {
      console.error('Error decoding access token:', error);
      throw new Error(error);
    }
  };
}
