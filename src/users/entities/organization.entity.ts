import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

export enum schoolType {
    PRIVATE = 'Private_School_Locations_Current',
    PUBLIC = 'Public_School_Location_201819',
    // CHARTER = 'Independent-learner',
    // HOME = 'super-admin',
    // POSTSECONDARY = 'admin',
  }

  registerEnumType(schoolType, {
    name: 'schoolType',
    description: 'The School Type assigned',
  });
@Entity({ name: 'Organization' })
@ObjectType()
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    @Field()
    id : string;

    @Column({default: ''})
    @Field({nullable: true})
    NAME : string;

    @Column({ 
        type: 'enum',
        enum: schoolType,
        default: schoolType.PRIVATE
    })
    @Field(type => schoolType) // like  PublicSchool , PrivateSchool 
    category : schoolType;

    @Column({ nullable: true })
    @Field({nullable : true})
    ZIP: string;


    @Column({nullable: true})
    @Field({nullable: true})
    CITY: string;

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