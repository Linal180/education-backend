import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class EvaluationPreferenceInput {
  @Field({ nullable: true })
  name: string;
}