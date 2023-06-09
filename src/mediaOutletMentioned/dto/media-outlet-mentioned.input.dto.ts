
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class mediaOutletMentiondInput {
  @Field({ nullable: true })
  name: string;
}