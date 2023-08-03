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
      const graphApiEndpoint = 'https://graph.microsoft.com/v1.0/me';

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.get(graphApiEndpoint, { headers });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}