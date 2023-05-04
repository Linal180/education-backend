import { Field, InputType, Int, ObjectType , PickType, registerEnumType } from "@nestjs/graphql";
import PaginationInput from "../../pagination/dto/pagination-input.dto";
import { Column } from "typeorm";
import { schoolType } from "../entities/organization.entity";
import { isEnumType } from "graphql";


@InputType()
export class OrganizationUserInput {

    @Field()
    name : string;

    @Field()
    zip: string;

    @Field()
    city: string;

    @Field(type => schoolType) // like  PublicSchool , PrivateSchool 
    category : schoolType;

    @Field((type) => PaginationInput ,{ nullable: true })
    paginationOptions?: PaginationInput;

}

@InputType()
export class OrganizationSearchInput  extends PickType(OrganizationUserInput, [
    'category' , 'paginationOptions'
  ] as const) {

    @Field({nullable: true})
    searchSchool: string;

}
