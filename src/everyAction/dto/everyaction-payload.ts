import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class EveryActionPayload {
  userLog: string;

  meta?: Object; 
}