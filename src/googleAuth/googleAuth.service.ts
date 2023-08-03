import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google, Auth } from 'googleapis';

@Injectable()
export class GoogleAuthService {
  oauthClient: Auth.OAuth2Client
  constructor(
    private readonly configService: ConfigService,

  ){
    const clientID = this.configService.get('google.clientId');
    const clientSecret = this.configService.get('google.clientSecret');

    this.oauthClient = new google.auth.OAuth2(
      clientID,
      clientSecret
    );
  }

  async authenticate(token: string): Promise<any> {
    return await this.oauthClient.getTokenInfo(token);
  }


}