import { Field, ObjectType } from "@nestjs/graphql";
import { Organization } from "../entities/organization.entity";
import { ResponsePayload } from "./response-payload.dto";
import PaginationPayload from "../../pagination/dto/pagination-payload.dto";
//"src/pagination/dto/pagination-payload.dto"

@ObjectType()
export class OrganizationPayload {
  @Field(type => [Organization],  { nullable: true })
  organization: Organization[];

  @Field(type => PaginationPayload, { nullable: true })
  pagination?: PaginationPayload

  @Field({ nullable: true })
  response?: ResponsePayload;
}