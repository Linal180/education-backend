import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SubjectAreaInput {
  @Field({ nullable: true })
  name: string;
}
