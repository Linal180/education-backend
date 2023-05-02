import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import PaginationInput from "../../pagination/dto/pagination-input.dto";
import { Column } from "typeorm";


@InputType()
export class OrganizationUserInput {

    @Field({nullable: true})
    id?: string;

    @Field({nullable: true})
    name : string;


    @Field({nullable: true}) // like  PublicSchool , PrivateSchool 
    category : string;


    @Field({nullable : true})
    zipCode: string;


    @Field({nullable: true})
    city: string;


    // @Field((type) => PaginationInput)
    // paginationOptions: PaginationInput;

}
