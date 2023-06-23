import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FormatInput {
  @Field({ nullable: true })
  name: string;
}
