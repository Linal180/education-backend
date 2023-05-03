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
    NAME : string;


    @Field(type => schoolType) // like  PublicSchool , PrivateSchool 
    category : schoolType;


    @Field({nullable : true})
    ZIP: string;


    @Field({nullable: true})
    CITY: string;


    @Field((type) => PaginationInput)
    paginationOptions: PaginationInput;

}
