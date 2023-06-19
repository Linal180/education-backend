import { Field, InputType } from "@nestjs/graphql";
@InputType()
export class JournalistInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true  , defaultValue: null})
  organization?: string;

}