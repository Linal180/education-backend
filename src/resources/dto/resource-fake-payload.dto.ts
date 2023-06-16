import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class ResourceFake {
  @Field()
  id: string;
  @Field()
  contentTitle: string;
  @Field()
  contentDescription: string;
  @Field()
  estimatedTimeToComplete: string;
  @Field()
  journalist: string;
  @Field()
  linksToContent: string;
  @Field()
  resourceType: string;
  @Field()
  nlnoTopNavigation: string;
  @Field()
  format: string;
  @Field()
  gradeLevel: string;
  @Field()
  classRoomNeed: string;
  @Field()
  subjectArea: string;
  @Field()
  nlpStandard: string;
  @Field()
  newsLiteracyTopic: string;
  @Field()
  contentWarning: string;
  @Field()
  evaluationPreference: string;
  @Field()
  assessmentType: string;
  @Field()
  prerequisite: string;

}
