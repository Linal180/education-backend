import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class wordWallTermLinkInput {
  @Field({ nullable: true })
  Term: string;
}

@InputType()
export class wordWallLinkInput {
  @Field({ nullable: true })
  name: string;
}