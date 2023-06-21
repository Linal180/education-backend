import { Field, InputType, Int, ObjectType , PickType, registerEnumType } from "@nestjs/graphql";
import PaginationInput from "../../pagination/dto/pagination-input.dto";
import { Organization, schoolType } from "../entities/organization.entity";



@InputType()
export class OrganizationInput {

    @Field({nullable: false})
    name : string;

    @Field({nullable: false})
    zip: string;

    @Field({nullable: false})
    city: string;

    @Field({nullable: true})
    state: string;

    @Field({nullable: true})
    street: string;

    @Field(type => schoolType) // like  PublicSchool , PrivateSchool 
    category : schoolType;

}

@InputType()
export class OrganizationSearchInput  extends PickType(OrganizationInput, [
    'category' 
  ] as const) {

    @Field({nullable: true})
    searchSchool: string;

    @Field((type) => PaginationInput ,{ nullable: true })
    paginationOptions?: PaginationInput;

}
