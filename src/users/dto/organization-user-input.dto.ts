import { Field, InputType, Int, ObjectType , registerEnumType } from "@nestjs/graphql";
import PaginationInput from "../../pagination/dto/pagination-input.dto";
import { Column } from "typeorm";
import { schoolType } from "../entities/organization.entity";
import { isEnumType } from "graphql";


@InputType()
export class OrganizationUserInput {

    @Field({nullable: true})
    id?: string;

    @Field({nullable: true})
    searchSchool: string;


    @Field(type => schoolType) // like  PublicSchool , PrivateSchool 
    category : schoolType;

    @Field((type) => PaginationInput ,{ nullable: true })
    paginationOptions?: PaginationInput;

}
