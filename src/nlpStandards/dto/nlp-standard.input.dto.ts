import { Field, InputType, ObjectType } from "@nestjs/graphql";
@InputType()
export class NlpStandardInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;
}

@ObjectType()
export class NlpStandardPayload {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;
}