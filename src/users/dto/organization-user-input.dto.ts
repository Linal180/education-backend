import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column } from "typeorm";


@InputType()
export class OrganizationUserInput {
    @Column()
    @Field()
    name : string;

    @Column()
    @Field({nullable: true}) // like  PublicSchool , PrivateSchool 
    category : string;

    @Column({ nullable: true })
    @Field({nullable : true})
    zipCode: string;


    @Column({nullable: true})
    @Field({nullable: true})
    city: string;


}
