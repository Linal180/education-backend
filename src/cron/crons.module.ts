import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronServices } from './cron.services';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    HttpModule,
  ],
  providers:[CronServices]
})
export class CronsModule {}