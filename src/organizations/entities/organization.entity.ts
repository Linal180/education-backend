import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum schoolType {
    PRIVATE = 'Private_School_Locations_Current',
    PUBLIC = 'Public_School_Location_201819',
    COLLEGE_OR_UNIVERSITY = 'Postsecondary_School_Locations_Current',
    CHARTER = 'School_Characteristics_Current', 
  }

  registerEnumType(schoolType, {
    name: 'schoolType',
    description: 'The School Type assigned',
  });
@Entity({ name: 'Organization' })
@ObjectType()
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({default: ''})
    @Field({nullable: true})
    name : string;

    @Column({ 
        type: 'enum',
        enum: schoolType,
        default: schoolType.PRIVATE
    })
    @Field(type => schoolType) // like  PublicSchool , PrivateSchool 
    category : schoolType;

    @Column({ nullable: true })
    @Field({nullable : true})
    zip: string;


    @Column({nullable: true})
    @Field({nullable: true})
    city: string;

    @ManyToOne(()=> User , user => user.organizations )
    user : User;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: string;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: string;
    
}