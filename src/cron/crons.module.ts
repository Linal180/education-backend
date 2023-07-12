import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronServices } from './cron.services';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
  ],
  providers:[CronServices],
  exports: [CronServices]
})
export class CronsModule {}