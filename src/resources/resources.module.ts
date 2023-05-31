import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssessmentType } from "../AssessmentTypes/entities/assessment-type.entity";
import { ClassRoomNeed } from "../ClassRoomNeeds/entities/classroom-needs.entity";
import { ContentLink } from "../ContentLinks/entities/content-link.entity";
import { ContentWarning } from "../ContentWarnings/entities/content-warning.entity";
import { EvaluationPreference } from "../EvaluationPreferences/entities/evaluation-preference.entity";
import { Format } from "./entities/format.entity";
import { Grade } from "../Grade/entities/grade-levels.entity";
import { Journalist } from "../Journalists/entities/journalist.entity";
import { NewsLiteracyTopic } from "../newLiteracyTopic/entities/newliteracy-topic.entity";
import { NLNOTopNavigation } from "../nlnoTopNavigation/entities/nlno-top-navigation.entity";
import { NlpStandard } from "../nlpStandards/entities/nlp-standard.entity";
import { Prerequisite } from "../Prerequisite/entities/prerequisite.entity";
import { ResourceType } from "./entities/resource-types.entity";
import { Resource } from "./entities/resource.entity";
import { SubjectArea } from "../subjectArea/entities/subject-areas.entity";
import { ResourcesResolver } from "./resolvers/resources.resolver";
import { ResourcesService } from "./services/resources.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource, Format, 
      NLNOTopNavigation, ResourceType,Grade, 
      ClassRoomNeed, SubjectArea, NlpStandard,
       NewsLiteracyTopic,ContentWarning, 
       EvaluationPreference, AssessmentType,
        Prerequisite,Journalist, 
       ContentLink]),
  ],
  providers: [ResourcesResolver, ResourcesService],
  exports: [TypeOrmModule, ResourcesService],
})
export class ResourcesModule { }
