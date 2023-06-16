import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PrerequisiteInput {
  @Field({ nullable: true })
  name: string;
}