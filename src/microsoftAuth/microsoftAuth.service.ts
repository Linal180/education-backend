import { Injectable } from "@nestjs/common";
import {ConfidentialClientApplication } from '@azure/msal-node'
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class MicrosoftAuthService {
  private readonly cca: ConfidentialClientApplication;
  constructor(
    private readonly configService: ConfigService
  ) {
    const clientId = this.configService.get<string>('microsoft.clientId')   ;
    const clientSecret = this.configService.get<string>('microsoft.clientSecret')   ;

    if (!clientId || !clientSecret) {
      throw new Error("Missing clientId or clientSecret in configuration.");
    }
    this.cca = new ConfidentialClientApplication({
      auth: {
        clientId,
        clientSecret
      }
    });
  }

  async authenticate(accessToken: string) {
    try {
      const graphUserInfo = `https://graph.microsoft.com/oidc/userinfo`

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const userInfoResponse = await axios.get(graphUserInfo, { headers });

      return userInfoResponse.data
      
    } catch (error) {
      console.log(error);
    }
  }
}