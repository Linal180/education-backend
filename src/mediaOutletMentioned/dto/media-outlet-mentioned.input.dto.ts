
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class MediaOutletMentiondInput {
  @Field({ nullable: true })
  name: string;
}