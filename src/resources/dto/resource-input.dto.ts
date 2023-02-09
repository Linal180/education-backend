import { Field, InputType } from '@nestjs/graphql';
import { AssessmentType } from '../entities/assessement-type.entity';
import { ClassRoomNeed } from '../entities/classroom-needs.entity';
import { ContentLink } from '../entities/content-link.entity';
import { ContentWarning } from '../entities/content-warning.entity';
import { EvaluationPreference } from '../entities/evaluation-preference.entity';
import { Format } from '../entities/format.entity';
import { Grade } from '../entities/grade-levels.entity';
import { Journalist } from '../entities/journalist.entity';
import { NewsLiteracyTopic } from '../entities/newliteracy-topic.entity';
import { NLNOTopNavigation } from '../entities/nlno-top-navigation.entity';
import { NlpStandard } from '../entities/nlp-standard.entity';
import { Prerequisite } from '../entities/prerequisite.entity';
import { ResourceType } from '../entities/resource-types.entity';
import { SubjectArea } from '../entities/subject-areas.entity';

@InputType()
export class CreateResourceInput {

  @Field({ nullable: true })
  contentTitle: string;

  @Field({ nullable: true })
  contentDescription: string;

  @Field({ nullable: true })
  estimatedTimeToComplete: string;

  @Field(type => [Journalist], { nullable: true })
  journalists: Journalist[];

  @Field(type => [ContentLink], { nullable: true })
  linksToContent: ContentLink[];

  @Field(type => [ResourceType], { nullable: true })
  resourceTypes: ResourceType[];

  @Field(type => [NLNOTopNavigation], { nullable: true })
  nlnoTopNavigations: NLNOTopNavigation[];

  @Field(type => [Format], { nullable: true })
  formats: Format[];

  @Field(type => [Grade], { nullable: true })
  gradeLevels: Grade[];

  @Field(type => [ClassRoomNeed], { nullable: true })
  classRoomNeeds: ClassRoomNeed[];

  @Field(type => [SubjectArea], { nullable: true })
  subjectAreas: SubjectArea[];

  @Field(type => [NlpStandard], { nullable: true })
  nlpStandards: NlpStandard[];

  @Field(type => [NewsLiteracyTopic], { nullable: true })
  newsLiteracyTopics: NewsLiteracyTopic[];

  @Field(type => [ContentWarning], { nullable: true })
  contentWarnings: ContentWarning[];

  @Field(type => [EvaluationPreference], { nullable: true })
  evaluationPreferences: EvaluationPreference[];

  @Field(type => [AssessmentType], { nullable: true })
  assessmentTypes: AssessmentType[];

  @Field(type => [Prerequisite], { nullable: true })
  prerequisites: Prerequisite[];


}
