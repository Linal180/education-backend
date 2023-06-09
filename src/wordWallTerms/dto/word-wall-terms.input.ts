import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class WordWallTermLinkInput {
  @Field({ nullable: true })
  name: string;
  
}