import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class NLNOTopNavigationInput {
  @Field({ nullable: true })
  name: string;
}