import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AdminDeleteUserCommandOutput, AdminUpdateUserAttributesCommandOutput,
  CognitoIdentityProvider, GetUserCommandOutput, GlobalSignOutCommandOutput, InitiateAuthCommand
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
      console.log("Error in getCognitoUser", error);
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

      const clientId = this.configService.get<string>('aws.clientId');
      const clientSecret = this.configService.get<string>('aws.clientSecret');
      const authTokenEndpoint = this.configService.get<string>('aws.AuthEndpoint');
      const redirectUri = this.configService.get<string>('aws.redirectUri');
      console.log("redirectUri", redirectUri)
      console.log("Authorization", `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`)
      const response = await axios.post(
        authTokenEndpoint,
        {
          grant_type: 'authorization_code',
          client_id: clientId,
          code,
          redirect_uri: redirectUri,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        'refreshToken': response['refresh_token'],
        'accessToken': response['access_token']
      }
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data.error_description, HttpStatus.BAD_REQUEST, { cause: error });
      } else {
        throw error;
      }
    }
  }

  // Initiate AWS auth
  async initiateAuth(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const result = await this.client.send(new InitiateAuthCommand({
        ClientId: this.configService.get<string>('aws.clientId'),
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
          SECRET_HASH: this.configService.get<string>('aws.clientSecret'),
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

  getAwsUserEmail(awsUser: GetUserCommandOutput): string {
    const emailAttribute = awsUser.UserAttributes.find((attribute) => attribute.Name === 'email');
    return emailAttribute ? emailAttribute.Value : '';
  }
}
