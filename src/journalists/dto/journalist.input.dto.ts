import { Field, InputType } from "@nestjs/graphql";
@InputType()
export class JournalistInput {
  @Field({ nullable: true })
  Name: string;

  @Field({ nullable: true  , defaultValue: null})
  Organization?: string;

}