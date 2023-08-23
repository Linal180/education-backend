import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum SchoolType {
  K_12_PUBLIC_SCHOOL = 'Public_School_Location_201819',
  K_12_PRIVATE_SCHOOL = 'Private_School_Locations_Current',
  COLLEGE_OR_UNIVERSITY = 'Postsecondary_School_Locations_Current',
  PUBLIC_LIBRARY = 'Public_Library',
  HOME_SCHOOL_OR_VIRTUAL_SCHOOL = 'Homeschool_Or_Virtual_School',
  COMMUNITY_ORGANIZATION = 'Community_Organization',
  I_DONOT_WORK_IN_EDUCATION = 'I_Donot_Work_In_Education'
  // CHARTER = 'School_Characteristics_Current', 
}

registerEnumType(SchoolType, {
  name: 'SchoolType',
  description: 'The School Type assigned',
});
@Entity({ name: 'Organization' })
@ObjectType()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  @Field({ nullable: true })
  name: string;

  @Column({ nullable: true })
  @Field(type => SchoolType) // like  PublicSchool , PrivateSchool 
  category: SchoolType;

  @Column({ nullable: true })
  @Field({ nullable: true })
  zip: string;


  @Column({ nullable: true })
  @Field({ nullable: true })
  city: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  state: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  street: string;

  @OneToMany(() => User, user => user.organization, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  users: User[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;

}