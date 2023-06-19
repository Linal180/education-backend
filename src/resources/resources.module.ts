import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Resource } from "./entities/resource.entity";
import { ResourcesResolver } from "./resolvers/resources.resolver";
import { ResourcesService } from "./services/resources.service";
import { ConfigModule } from "@nestjs/config";
import { ContentLinkModule } from "src/ContentLinks/content-link.module";
import { AssessmentTypeModule } from "src/AssessmentTypes/assessment-type.module";
import { ContentWarningModule } from "src/ContentWarnings/content-warning.module";
import { EvaluationPreferenceModule } from "src/EvaluationPreferences/evaluation-preference.module";
import { GradesModule } from "src/Grade/grades.module";
import { JournalistsModule } from "src/Journalists/journalists.module";
import { NewsLiteracyTopicModule } from "src/newLiteracyTopic/newsliteracy-topic.module";
import { NLNOTopNavigationModule } from "src/nlnoTopNavigation/nlno-top-navigation.module";
import { NlpStandardModule } from "src/nlpStandards/nlp-standard.module";
import { PrerequisitesModule } from "src/Prerequisite/prerequisite.module";
import { ClassRoomNeedModule } from "src/ClassRoomNeeds/classroom-need.module";
import { SubjectAreaModule } from "src/subjectArea/subjectArea.module";
import { ResourceTypeModule } from "src/ResourceType/resource-type.module";
import { FormatModule } from "src/Format/format.module";
import { ResourcesController } from "./controller/resource.controller";
import { CronsModule }   from "../cron/crons.module"
import { CronServices } from "..//cron/cron.services";
import { HttpModule, HttpService } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forFeature([Resource]),
    CronsModule,
    ConfigModule,
    ContentLinkModule,
    AssessmentTypeModule,
    ClassRoomNeedModule,
    ContentWarningModule,
    EvaluationPreferenceModule,
    GradesModule,
    JournalistsModule,
    NewsLiteracyTopicModule,
    NLNOTopNavigationModule,
    NlpStandardModule,
    PrerequisitesModule,
    SubjectAreaModule,
    ResourceTypeModule,
    FormatModule,
    HttpModule,
    
  ],
  providers: [ResourcesResolver, ResourcesService , CronServices ],
  controllers:[ResourcesController],
  exports: [TypeOrmModule, ResourcesService],
})
export class ResourcesModule { }
