import { Field, InputType } from "@nestjs/graphql";
@InputType()
export class WordWallInput {
  @Field({ nullable: true })
  name: string;
  
}

@InputType()
export class WordWallTermInput {
  @Field({ nullable: true })
  Term: string;
  
}