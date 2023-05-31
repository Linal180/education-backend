import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronServices } from './cron.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from 'src/resources/entities/resource.entity';
import { Format } from 'src/resources/entities/format.entity';
import { ClassRoomNeed } from '../ClassRoomNeeds/entities/classroom-needs.entity';
import { SubjectArea } from '../subjectArea/entities/subject-areas.entity';
import { ResourceType } from 'src/resources/entities/resource-types.entity';
import { Grade } from '../Grade/entities/grade-levels.entity';
import { NlpStandard } from '../nlpStandards/entities/nlp-standard.entity';
import { ContentWarning } from '../ContentWarnings/entities/content-warning.entity';
import { EvaluationPreference } from '../EvaluationPreferences/entities/evaluation-preference.entity';
import { NewsLiteracyTopic } from '../newLiteracyTopic/entities/newliteracy-topic.entity';
import { NLNOTopNavigation } from '../nlnoTopNavigation/entities/nlno-top-navigation.entity';
import { AssessmentType } from '../AssessmentTypes/entities/assessment-type.entity';
import { Prerequisite } from '../Prerequisite/entities/prerequisite.entity';
import { Journalist } from '../Journalists/entities/journalist.entity';
import { ContentLink } from '../ContentLinks/entities/content-link.entity';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { cronController } from './cron.controller';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([Resource, Format, 
      NLNOTopNavigation, ResourceType,Grade, 
      ClassRoomNeed, SubjectArea, NlpStandard,
       NewsLiteracyTopic,ContentWarning, 
       EvaluationPreference, AssessmentType,
        Prerequisite,Journalist, 
       ContentLink]),
  ],
  controllers:[cronController],
  providers:[CronServices]
})
export class CronsModule {}