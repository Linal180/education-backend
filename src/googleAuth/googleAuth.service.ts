import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  oauthClient: OAuth2Client
  constructor(
    private readonly configService: ConfigService,

  ){
    const clientID = this.configService.get('google.clientId');
    const clientSecret = this.configService.get('google.clientSecret');
 
    this.oauthClient = new OAuth2Client(
      clientID,
      clientSecret
    );
  }

  async authenticate(token: string): Promise<any> {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    return ticket.getPayload()
  }


}