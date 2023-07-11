import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class EssentialQuestionInput {
  @Field({ nullable: true })
  name: string;
}
@InputType()
export class EssentialQuestionTitleInput {
  @Field({ nullable: true })
  Title: string;
}