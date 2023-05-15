import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronServices } from './cron.services';

@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
  providers:[CronServices]
})
export class CronsModule {}