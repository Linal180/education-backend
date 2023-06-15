import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronServices } from './cron.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from 'src/resources/entities/resource.entity';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';




@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([Resource]),
  ],
  providers:[CronServices]
})
export class CronsModule {}