import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AdminDeleteUserCommandOutput, AdminUpdateUserAttributesCommandOutput,
  CognitoIdentityProvider, GetUserCommandOutput,
   GlobalSignOutCommandOutput, InitiateAuthCommand, CodeMismatchException, NotAuthorizedException
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AwsCognitoService {
  private userPoolId: string;
  private client: CognitoIdentityProvider;

  constructor(private configService: ConfigService) {
    // Create a new client for the specified region
    const accessKeyId = configService.get<string>('aws.key');
    const secretAccessKey = configService.get<string>('aws.secret');
    const apiVersion = configService.get<string>('aws.version');
    const region = configService.get<string>('aws.region');

    this.userPoolId = configService.get<string>('aws.userPoolId');
    this.client = new CognitoIdentityProvider({
      region,
      apiVersion,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
  }

  async createUser(username: string, email: string, password: string): Promise<AdminCreateUserCommandOutput> {
    const params = {
      UserPoolId: this.userPoolId,
      Username: username,
      TemporaryPassword: 'Admin@123',
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'custom:role',
          Value: UserRole.EDUCATOR,
        },
      ],
      ValidationData: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    };

    try {
      const response = await this.client.adminCreateUser(params);
      const { User: { Username } } = response;

      if (Username) {
        const updateParams = {
          Password: password,
          UserPoolId: this.userPoolId,
          Username: Username,
          MessageAction: 'SUPPRESS',
          Permanent: true,
        };

        await this.client.adminSetUserPassword(updateParams);

        const updateStatusParams = {
          UserPoolId: this.userPoolId,
          Username: Username,
          UserAttributes: [
            {
              Name: 'email_verified',
              Value: 'true',
            }
          ],
        };

        await this.client.adminUpdateUserAttributes(updateStatusParams);

        return response;
      }
    } catch (error) {
      const {name, message } = error;

      if (name === 'UserLambdaValidationException') {
        const jsonStartIndex = message.indexOf('{');
        const jsonEndIndex = message.lastIndexOf('}') + 1;
        const jsonString = message.substring(jsonStartIndex, jsonEndIndex);

        return JSON.parse(jsonString);
      } else {
        console.log(error)
        // throw new Error('Failled to register user on AWS Cognito');
        throw new Error(error);

      }
    }
  }

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

  // Verify and get cognito user
  async getCognitoUser(accessToken: string): Promise<GetUserCommandOutput> {
    try {
      const params = {
        AccessToken: accessToken,
      };

      const response = await this.client.getUser(params)
      return response;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  // Delete cognito user
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

  // Sign user out
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

  // Get user tokens
  async getTokens(code: string): Promise<{ refreshToken: string, accessToken: string }> {
    try {
      if (!code) {
        throw new Error('No Auth code provided.');
      }

      const authTokenEndpoint = this.configService.get<string>('aws.AuthEndpoint');
      const redirectUri = this.configService.get<string>('aws.redirectUri');

      const response = await axios.post(
        authTokenEndpoint,
        {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          code,
          redirect_uri: redirectUri,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        'refreshToken': response.data.refresh_token,
        'accessToken': response.data.access_token
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // Initiate AWS auth
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

  /**
   * 
   * @param email 
   * @param password 
   * @returns accessToken 
   */
  // async loginUser(user: User, password: string): Promise<{ accessToken: string, refreshToken: string }> {
  //   const secretHash = this.calculateSecretHash(user.username);
  //   console.log(secretHash, "=====================")
  //   const params = {
  //     AuthFlow: 'USER_PASSWORD_AUTH',
  //     ClientId: this.clientId,
  //     AuthParameters: {
  //       USERNAME: user.username,
  //       PASSWORD: password,
  //       SECRET_HASH: this.clientSecret,
  //     },
  //   };
  //   console.log(user.username, ">>>>>>>>>>>>>>>>>>>>>>>>>", secretHash)
  //   console.log("**********", params, "*************")

  //   try {
  //     const { AuthenticationResult: { AccessToken, RefreshToken } } = await this.client.initiateAuth(params);
  //     console.log("*********************")

  //     console.log("*********************")
  //     console.log("*********************")
  //     return { accessToken: AccessToken, refreshToken: RefreshToken };
  //   } catch (error) {
  //     console.log(error, "<<<<<<<<<<<<<<<<<<<<<<<<<")
  //     throw new Error('Invalid credentials');
  //   }
  // }

  getAwsUserEmail(awsUser: GetUserCommandOutput): string {
    const emailAttribute = awsUser.UserAttributes.find((attribute) => attribute.Name === 'email');
    return emailAttribute ? emailAttribute.Value : '';
  }

  getAwsUserSub(awsUser: AdminCreateUserCommandOutput): string {
    const emailAttribute = awsUser.User.Attributes.find((attribute) => attribute.Name === 'sub');
    return emailAttribute ? emailAttribute.Value : '';
  }

  async loginUser(user: User, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const secretHash = this.calculateSecretHash(user.username);

    const params = {
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
        throw new Error('Invalid credentials');
      }

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  }


  calculateSecretHash(username: string): string {
    const message = username + this.clientId;
    const hash = crypto.createHmac('SHA256', this.clientSecret).update(message).digest('base64');
    return hash;
  }
}
