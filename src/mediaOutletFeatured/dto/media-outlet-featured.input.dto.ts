import { Field, InputType } from "@nestjs/graphql";
@InputType()
export class MediaOutletFeaturedInput {
  @Field({ nullable: true })
  name: string;
}