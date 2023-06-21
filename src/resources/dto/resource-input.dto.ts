import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { AssessmentTypeInput } from '../entities/assessment-type.entity';
import { ClassRoomNeedInput } from '../entities/classroom-needs.entity';
import { linksToContentInput } from '../entities/content-link.entity';
import { ContentWarningInput } from '../entities/content-warning.entity';
import { EvaluationPreferenceInput } from '../entities/evaluation-preference.entity';
import { FormatInput } from '../entities/format.entity';
import { GradeInput } from '../../Grade/entities/grade-levels.entity';
import { JournalistInput } from '../entities/journalist.entity';
import { NewsLiteracyTopicInput } from '../entities/newliteracy-topic.entity';
import { NLNOTopNavigationInput } from '../entities/nlno-top-navigation.entity';
import { NlpStandardInput } from '../entities/nlp-standard.entity';
import { PrerequisiteInput } from '../entities/prerequisite.entity';
import { ResourceTypeInput } from '../entities/resource-types.entity';
import { SubjectAreaInput } from '../../subjectArea/entities/subject-areas.entity';

@InputType()
@ObjectType()
export class CreateResourceInput {

  @Field({ nullable: true })
  contentTitle: string;

  @Field({ nullable: true })
  contentDescription: string;

  @Field({ nullable: true })
  estimatedTimeToComplete: string;o

  @Field(type => [JournalistInput], { nullable: true })
  journalists: JournalistInput[];

  @Field(type => [linksToContentInput], { nullable: true })
  linksToContents: linksToContentInput[];

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
