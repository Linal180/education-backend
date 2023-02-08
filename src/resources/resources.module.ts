import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssessmentType } from "./entities/assessement-type.entity";
import { ClassRoomNeed } from "./entities/classroom-needs.entity";
import { ContentLink } from "./entities/content-link.entity";
import { ContentWarning } from "./entities/content-warning.entity";
import { EvaluationPreference } from "./entities/evaluation-preference.entity";
import { Format } from "./entities/format.entity";
import { Grade } from "./entities/grade-levels.entity";
import { Journalist } from "./entities/journalist.entity";
import { NewsLiteracyTopic } from "./entities/newliteracy-topic.entity";
import { NLNOTopNavigation } from "./entities/nlno-top-navigation.entity";
import { NlpStandard } from "./entities/nlp-standard.entity";
import { Prerequisite } from "./entities/prerequisite.entity";
import { ResourceType } from "./entities/resource-types.entity";
import { Resource } from "./entities/resource.entity";
import { SubjectArea } from "./entities/subject-areas.entity";
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
