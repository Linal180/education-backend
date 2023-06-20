import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Resource } from "./entities/resource.entity";
import { ResourcesResolver } from "./resolvers/resources.resolver";
import { ResourcesService } from "./services/resources.service";
import { ConfigModule } from "@nestjs/config";
import { ContentLinkModule } from "src/contentLinks/content-link.module";
import { AssessmentTypeModule } from "src/assessmentTypes/assessment-type.module";
import { ContentWarningModule } from "src/contentWarnings/content-warning.module";
import { EvaluationPreferenceModule } from "src/evaluationPreferences/evaluation-preference.module";
import { GradesModule } from "src/grade/grades.module";
import { JournalistsModule } from "src/journalists/journalists.module";
import { NewsLiteracyTopicModule } from "src/newLiteracyTopic/newsliteracy-topic.module";
import { NLNOTopNavigationModule } from "src/nlnoTopNavigation/nlno-top-navigation.module";
import { NlpStandardModule } from "src/nlpStandards/nlp-standard.module";
import { PrerequisitesModule } from "src/prerequisite/prerequisite.module";
import { ClassRoomNeedModule } from "src/classRoomNeeds/classroom-need.module";
import { SubjectAreaModule } from "src/subjectArea/subjectArea.module";
import { ResourceTypeModule } from "src/resourceType/resource-type.module";
import { FormatModule } from "src/format/format.module";
import { ResourcesController } from "./controller/resource.controller";
import { WordWallTermsModule } from "../wordWallTerms/word-wall-terms.module";
import { WordWallTermLinksModule } from "../wordWallTermLinks/word-wall-term-link.module";
import { MediaOutletsFeaturedModule } from "../mediaOutletFeatured/media-outlet-featured.module";
import { MediaOutletsMentionedModule } from "../mediaOutletMentioned/media-outlet-mentiond.module";
import { EssentialQuestionsModule } from "../essentialQuestions/essential-questions.module";
import { CronsModule } from "../cron/crons.module";

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
    WordWallTermsModule,
    WordWallTermLinksModule,
    MediaOutletsFeaturedModule,
    MediaOutletsMentionedModule,
    EssentialQuestionsModule
  ],
  providers: [ResourcesResolver, ResourcesService],
  controllers: [ResourcesController],
  exports: [TypeOrmModule, ResourcesService],
})
export class ResourcesModule { }
