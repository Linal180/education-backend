import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class EssentialQuestionInput {
  @Field({ nullable: true })
  name: string;
}