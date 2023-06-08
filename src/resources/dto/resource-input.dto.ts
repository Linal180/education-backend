import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { AssessmentTypeInput } from '../../assessmentTypes/dto/assessment-type-input.dto';
import { ClassRoomNeedInput } from '../../classRoomNeeds/dto/classroom-need.input.dto';
import { LinksToContentInput } from '../../contentLinks/entities/content-link.entity';
import { FormatInput } from '../../format/entities/format.entity';
import { JournalistInput } from '../../journalists/dto/journalist.input.dto';
import { ResourceTypeInput } from '../../resourceType/dto/resource-type.input.dto';
import { NLNOTopNavigationInput } from '../../nlnoTopNavigation/dto/nlno-top-navigation.input.dto';
import { GradeInput } from '../../grade/dto/grade-level.input.dto';
import { SubjectAreaInput } from '../../subjectArea/dto/subject-area.input.dto';
import { NlpStandardInput } from '../../nlpStandards/dto/nlp-standard.input.dto';
import { NewsLiteracyTopicInput } from '../../newLiteracyTopic/dto/newsliteracy-topic.input.dto';
import { ContentWarningInput } from '../../contentWarnings/dto/content-warning.input.dto';
import { EvaluationPreferenceInput } from '../../evaluationPreferences/dto/evaluation-preference.input.dto';
import { PrerequisiteInput } from '../../prerequisite/dto/prerequisite.input.dto';


@InputType()
@ObjectType()
export class CreateResourceInput {

  @Field({ nullable: true })
  contentTitle: string;

  @Field({ nullable: true })
  contentDescription: string;

  @Field({ nullable: true })
  estimatedTimeToComplete: string; o

  @Field(type => [JournalistInput], { nullable: true })
  journalists: JournalistInput[];

  @Field(type => [LinksToContentInput], { nullable: true })
  linksToContents: LinksToContentInput[];

  @Field(type => [ResourceTypeInput], { nullable: true })
  resourceTypes: ResourceTypeInput[];

  @Field(type => [NLNOTopNavigationInput], { nullable: true })
  nlnoTopNavigations: NLNOTopNavigationInput[];

  @Field(type => [FormatInput], { nullable: true })
  formats: FormatInput[];

  @Field(type => [GradeInput], { nullable: true })
  gradeLevels: GradeInput[];

  @Field(type => [ClassRoomNeedInput], { nullable: true })
  classRoomNeeds: ClassRoomNeedInput[];

  @Field(type => [SubjectAreaInput], { nullable: true })
  subjectAreas: SubjectAreaInput[];

  @Field(type => [NlpStandardInput], { nullable: true })
  nlpStandards: NlpStandardInput[];

  @Field(type => [NewsLiteracyTopicInput], { nullable: true })
  newsLiteracyTopics: NewsLiteracyTopicInput[];

  @Field(type => [ContentWarningInput], { nullable: true })
  contentWarnings: ContentWarningInput[];

  @Field(type => [EvaluationPreferenceInput], { nullable: true })
  evaluationPreferences: EvaluationPreferenceInput[];

  @Field(type => [AssessmentTypeInput], { nullable: true })
  assessmentTypes: AssessmentTypeInput[];

  @Field(type => [PrerequisiteInput], { nullable: true })
  prerequisites: PrerequisiteInput[];


}
