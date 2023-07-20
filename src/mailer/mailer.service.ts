import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientResponse, MailService } from '@sendgrid/mail';


@Injectable()
export class MailerService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('SGMAILER')
    private readonly sgMail: MailService
  ) { }

  /**
   * Sends email forgot password
   * @param params 
   * @returns email forgot password 
   */
  async sendEmailForgotPassword(params: any): Promise<ClientResponse> {

    const { email, fullName, isAdmin, isInvite, providerName, token } = params

    const portalAppBaseUrl: string = this.configService.get<string>('epNextAppBaseURL') || `https://educationplatform.vercel.app/` 
    const templateId: string = isInvite || this.configService.get<string>('isInvite')
    const from: string = this.configService.get('FROM_EMAIL')

    const url = isInvite ? 
    // `${portalAppBaseUrl}/set-password?token=${token}` : 
    `${portalAppBaseUrl}/reset-password?token=${token}` : ``
    const msg = {
      to: email,
      from,
      templateId,
      dynamicTemplateData: {
        fullName,
        providerName,
        resetPasswordURL: url
      }
    };
    
    try {
      const [response] = await this.sgMail.send(msg);
      return response;
    } catch (error) {
      console.log("can't send email: -> sendEmailForget: " + error)
      console.error(error);
      if (error.response) {
        console.error(error.response.body)
      }
    }
  }
}
