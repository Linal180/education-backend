import { Field, InputType } from "@nestjs/graphql";
@InputType()
export class ContentWarningInput {
  @Field({ nullable: true })
  name: string;
}