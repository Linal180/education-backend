import { ConfigService } from "@nestjs/config";
import sgMail from '@sendgrid/mail';

export const SendGridMailer = {
  provide: 'SGMAILER',
  useFactory: async (configService: ConfigService) => {
    sgMail.setApiKey(configService.get<string>('SENDGRID_API_KEY'))
    return sgMail
  },
  inject: [ConfigService],
}