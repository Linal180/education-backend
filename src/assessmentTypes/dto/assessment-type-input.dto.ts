import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AssessmentTypeInput {
  @Field({ nullable: true })
  name: string;
}