import { Field, ObjectType } from "@nestjs/graphql";
import { Organization } from "../entities/organization.entity";
import { ResponsePayload } from "./response-payload.dto";


@ObjectType()
export class OrganizationPayload {
  @Field(type => [Organization],  { nullable: true })
  organization: Organization[]

  @Field({ nullable: true })
  response?: ResponsePayload;
}