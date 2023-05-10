import { Field, ObjectType } from '@nestjs/graphql';
import { ResponsePayloadResponse } from '../../users/dto/response-payload.dto';


@ObjectType()
export class FiltersType extends ResponsePayloadResponse {

  @Field(() => [String], { nullable: true })
  duration?: string[];

  @Field(() => [String], { nullable: true })
  journalists?: string[];

  @Field(() => [String], { nullable: true })
  linksToContents?: string[];

  @Field(() => [String], { nullable: true })
  resourceTypes?: string[];

  @Field(() => [String], { nullable: true })
  nlnoTopNavigations?: string[];

  @Field(() => [String], { nullable: true })
  formats?: string[];

  @Field(() => [String], { nullable: true })
  gradeLevels?: string[];

  @Field(() => [String], { nullable: true })
  classRoomNeeds?: string[];

  @Field(() => [String], { nullable: true })
  subjectAreas?: string[];

  @Field(() => [String], { nullable: true })
  nlpStandards?: string[];

  @Field(() => [String], { nullable: true })
  newsLiteracyTopics?: string[];

  @Field(() => [String], { nullable: true })
  contentWarnings?: string[];

  @Field(() => [String], { nullable: true })
  evaluationPreferences?: string[];

  @Field(() => [String], { nullable: true })
  assessmentTypes?: string[];

  @Field(() => [String], { nullable: true })
  prerequisites?: string[];
}

@ObjectType()
export class ResourcesFilters extends ResponsePayloadResponse{
  @Field(type => FiltersType, {nullable: true})
  filters: FiltersType
}