import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class NewsLiteracyTopicInput {
  @Field({ nullable: true })
  name: string;
}