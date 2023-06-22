import { Field, InputType } from "@nestjs/graphql";
@InputType()
export class GradeInput {
  @Field({ nullable: true })
  name: string;
}
