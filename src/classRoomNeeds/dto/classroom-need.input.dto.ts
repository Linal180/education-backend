import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ClassRoomNeedInput {
  @Field({ nullable: true })
  name: string;
}