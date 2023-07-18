import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendGridMailer } from './send-grid-mailer';

@Module({
  imports: [],
  providers: [MailerService, SendGridMailer],
  exports: [MailerService, SendGridMailer]
})
export class MailerModule { }
