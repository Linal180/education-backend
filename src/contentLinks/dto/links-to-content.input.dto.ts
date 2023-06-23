import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LinksToContentInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  url: string;
}