import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";


@Entity({ name: 'Organization' })
@ObjectType()
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    @Field()
    id : string;

    @Column({default: ''})
    @Field({defaultValue: ''})
    name : string;

    @Column({nullable : true})
    @Field({nullable: true}) // like  PublicSchool , PrivateSchool 
    category : string;

    @Column({ nullable: true })
    @Field({nullable : true})
    zipCode: string;


    @Column({nullable: true})
    @Field({nullable: true})
    city: string;

    @ManyToOne(()=> User , user => user.organizations )
    // @JoinTable({ name : "userOrganization"})
    user : User;

    @CreateDateColumn({ type: 'timestamptz' })
    @Field()
    createdAt: string;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    @Field()
    updatedAt: string;
    
}