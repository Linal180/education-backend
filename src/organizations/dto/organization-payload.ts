import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { Organization } from "../entities/organization.entity";
import { ResponsePayload } from "../../users/dto/response-payload.dto";
import PaginationPayload from "../../pagination/dto/pagination-payload.dto";
//"src/pagination/dto/pagination-payload.dto"

@ObjectType()
export class OrganizationPayload {
  @Field(type => Organization,  { nullable: true })
  organization: Organization;

  @Field(type => PaginationPayload, { nullable: true })
  pagination?: PaginationPayload

  @Field({ nullable: true })
  response?: ResponsePayload;
}

@ObjectType()
export class OrganizationsPayload extends PickType(OrganizationPayload , ['pagination', 'response']){
  @Field(type => [Organization],  { nullable: true })
  organizations: Organization[];
}


