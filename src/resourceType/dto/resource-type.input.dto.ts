import { Field, InputType } from "@nestjs/graphql";
@InputType()
export class ResourceTypeInput {
  @Field({ nullable: true })
  name: string;
}