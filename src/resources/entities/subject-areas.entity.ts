import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {
  Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Resource } from "./resource.entity";
import { User } from "../../users/entities/user.entity";

@Entity({ name: "SubjectAreas" })
@ObjectType()
export class SubjectArea {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({ nullable: true})
  recordId: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @ManyToMany(type => Resource, resource => resource.subjectArea, { onUpdate: 'CASCADE', onDelete: "CASCADE" })
  @JoinTable({ name: 'ResourcesSubjectAreas' })
  resources: Resource[];

  @ManyToMany(type => User, user => user.subjectArea )
  users: User[]

  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}


@InputType()
export class SubjectAreaInput {
  @Field({ nullable: true })
  name: string;
}
