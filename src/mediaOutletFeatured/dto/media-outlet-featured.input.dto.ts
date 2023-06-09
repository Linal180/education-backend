import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class mediaOutletFeaturedInput {
  @Field({ nullable: true })
  name: string;
}