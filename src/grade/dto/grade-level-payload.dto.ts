import { Field, ObjectType, OmitType } from "@nestjs/graphql";
import { Grade } from "../entities/grade-levels.entity";
import { ResponsePayload } from "../../users/dto/response-payload.dto";

@ObjectType()
export class gradeLevelPayloadDTO {
  @Field({ nullable: true })
  grade : Grade

  @Field({ nullable: true })
  response?: ResponsePayload;
}