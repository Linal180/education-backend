import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Resource } from "./entities/resource.entity";
import { ResourcesResolver } from "./resolvers/resources.resolver";
import { ResourcesService } from "./services/resources.service";
import { ConfigModule } from "@nestjs/config";
import { ContentLinkModule } from "../contentLinks/content-link.module";
import { AssessmentTypeModule } from "../assessmentTypes/assessment-type.module";
import { ContentWarningModule } from "../contentWarnings/content-warning.module";
import { EvaluationPreferenceModule } from "../evaluationPreferences/evaluation-preference.module";
import { GradesModule } from "../grade/grades.module";
import { JournalistsModule } from "../journalists/journalists.module";
import { NewsLiteracyTopicModule } from "../newLiteracyTopic/newsliteracy-topic.module";
import { NLNOTopNavigationModule } from "../nlnoTopNavigation/nlno-top-navigation.module";
import { NlpStandardModule } from "../nlpStandards/nlp-standard.module";
import { PrerequisitesModule } from "../prerequisite/prerequisite.module";
import { ClassRoomNeedModule } from "../classRoomNeeds/classroom-need.module";
import { SubjectAreaModule } from "../subjectArea/subjectArea.module";
import { ResourceTypeModule } from "../resourceType/resource-type.module";
import { FormatModule } from "../format/format.module";
import { ResourcesController } from "./controller/resource.controller";
import { WordWallTermsModule } from "../wordWallTerms/word-wall-terms.module";
import { WordWallTermLinksModule } from "../wordWallTermLinks/word-wall-term-link.module";
import { MediaOutletsFeaturedModule } from "../mediaOutletFeatured/media-outlet-featured.module";
import { MediaOutletsMentionedModule } from "../mediaOutletMentioned/media-outlet-mentiond.module";
import { EssentialQuestionsModule } from "../essentialQuestions/essential-questions.module";
import { CronsModule } from "../cron/crons.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    WordWallTermsModule,
    WordWallTermLinksModule,
    MediaOutletsFeaturedModule,
    MediaOutletsMentionedModule,
    EssentialQuestionsModule
  ],
  providers: [ResourcesResolver, ResourcesService ],
  controllers: [ResourcesController],
  exports: [TypeOrmModule, ResourcesService],
})
export class ResourcesModule { }
