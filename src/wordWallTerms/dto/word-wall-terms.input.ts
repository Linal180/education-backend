import { Field, InputType } from "@nestjs/graphql";
@InputType()
export class WordWallTermInput {
  @Field({ nullable: true })
  name: string;
  
}