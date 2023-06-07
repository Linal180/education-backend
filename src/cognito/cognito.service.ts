import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRole } from 'src/users/entities/role.entity';
import {
  AdminCreateUserCommandOutput,
  AdminDeleteUserCommandOutput, AdminUpdateUserAttributesCommandOutput,
  CognitoIdentityProvider, GetUserCommandOutput, GlobalSignOutCommandOutput,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { User } from 'src/users/entities/user.entity';
import * as crypto from 'crypto';
@Injectable()
export class AwsCognitoService {
  private userPoolId: string;
  private client: CognitoIdentityProvider;
  private clientId: string;
  private clientSecret: string;

  constructor(private configService: ConfigService) {
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

  async createUser(username: string, email: string, password: string) {
    const params = {
      UserPoolId: this.userPoolId,
      Username: username,
      TemporaryPassword: password,
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
    };

    try {
      const response = await this.client.adminCreateUser(params);
      console.log('User created:', response);
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
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
      throw error;
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
      // throw NotAuthorizedException;
      // throw new Error(error)
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
      const client = new CognitoIdentityServiceProvider({ region: process.env.AWS_REGION });
      const response = await this.client.initiateAuth(params);
      console.log("....response...",response);
      
      const accessToken = response.AuthenticationResult?.AccessToken;
      const refreshToken = response.AuthenticationResult?.RefreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error('Invalid credentials');
      }

      return { accessToken, refreshToken };
      return;
    } catch (error) {
      console.log(error, "<<<<<<<<<<<<<<<<<<<<<<<<<");
      throw new Error('Invalid credentials');
    }
  }


  // calculateSecretHash(username: string): string {
  //   const HMAC_SHA256_ALGORITHM = 'sha256';
  
  //   const signingKey = createHmac(HMAC_SHA256_ALGORITHM, this.clientSecret)
  //     .update(username)
  //     .digest('base64'); // Convert the signingKey to a base64-encoded string
  
  //   try {
  //     const mac = createHmac(HMAC_SHA256_ALGORITHM, signingKey);
  //     mac.update(this.clientId);
  //     const rawHmac = mac.digest();
  
  //     return rawHmac.toString('base64');
  //   } catch (error) {
  //     throw new Error('Error while calculating SecretHash');
  //   }
  // }

   calculateSecretHash(username: string): string {
    const message = username + this.clientId;
    const hash = crypto.createHmac('SHA256', this.clientSecret).update(message).digest('base64');
    return hash;
  }


}
