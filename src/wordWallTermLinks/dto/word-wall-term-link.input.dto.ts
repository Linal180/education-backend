import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class wordWallTermLinkInput {
  @Field({ nullable: true })
  name: string;

}