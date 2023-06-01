import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssessmentType } from "../AssessmentTypes/entities/assessment-type.entity";
import { ClassRoomNeed } from "../ClassRoomNeeds/entities/classroom-needs.entity";
import { ContentLink } from "../ContentLinks/entities/content-link.entity";
import { ContentWarning } from "../ContentWarnings/entities/content-warning.entity";
import { EvaluationPreference } from "../EvaluationPreferences/entities/evaluation-preference.entity";
import { Format } from "../Format/entities/format.entity";
import { Grade } from "../Grade/entities/grade-levels.entity";
import { Journalist } from "../Journalists/entities/journalist.entity";
import { NewsLiteracyTopic } from "../newLiteracyTopic/entities/newliteracy-topic.entity";
import { NLNOTopNavigation } from "../nlnoTopNavigation/entities/nlno-top-navigation.entity";
import { NlpStandard } from "../nlpStandards/entities/nlp-standard.entity";
import { Prerequisite } from "../Prerequisite/entities/prerequisite.entity";
import { ResourceType } from "../ResourceType/entities/resource-types.entity";
import { Resource } from "./entities/resource.entity";
import { SubjectArea } from "../subjectArea/entities/subject-areas.entity";
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

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource, Format, 
      NLNOTopNavigation, ResourceType,Grade, 
      ClassRoomNeed, SubjectArea, NlpStandard,
       NewsLiteracyTopic,ContentWarning, 
       EvaluationPreference, AssessmentType,
        Prerequisite,Journalist, 
       ContentLink]),
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
       ResourceTypeModule

  ],
  providers: [ResourcesResolver, ResourcesService],
  exports: [TypeOrmModule, ResourcesService],
})
export class ResourcesModule { }
