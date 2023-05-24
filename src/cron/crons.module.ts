import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronServices } from './cron.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from 'src/resources/entities/resource.entity';
import { Format } from 'src/resources/entities/format.entity';
import { ClassRoomNeed } from 'src/resources/entities/classroom-needs.entity';
import { SubjectArea } from 'src/resources/entities/subject-areas.entity';
import { ResourceType } from 'src/resources/entities/resource-types.entity';
import { Grade } from 'src/resources/entities/grade-levels.entity';
import { NlpStandard } from 'src/resources/entities/nlp-standard.entity';
import { ContentWarning } from 'src/resources/entities/content-warning.entity';
import { EvaluationPreference } from 'src/resources/entities/evaluation-preference.entity';
import { NewsLiteracyTopic } from 'src/resources/entities/newliteracy-topic.entity';
import { NLNOTopNavigation } from 'src/resources/entities/nlno-top-navigation.entity';
import { AssessmentType } from 'src/resources/entities/assessment-type.entity';
import { Prerequisite } from 'src/resources/entities/prerequisite.entity';
import { Journalist } from 'src/resources/entities/journalist.entity';
import { ContentLink } from 'src/resources/entities/content-link.entity';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    TypeOrmModule.forFeature([Resource, Format, 
      NLNOTopNavigation, ResourceType,Grade, 
      ClassRoomNeed, SubjectArea, NlpStandard,
       NewsLiteracyTopic,ContentWarning, 
       EvaluationPreference, AssessmentType,
        Prerequisite,Journalist, 
       ContentLink]),
  ],
  providers:[CronServices]
})
export class CronsModule {}