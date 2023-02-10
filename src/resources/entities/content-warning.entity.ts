import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {
  Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Resource } from "./resource.entity";

@Entity({ name: "ContentWarnings" })
@ObjectType()
export class ContentWarning {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @ManyToMany(type => Resource, resource => resource.contentWarning, { onUpdate: 'CASCADE', onDelete: "CASCADE" })
  @JoinTable({ name: 'ResourcesContentWarnings' })
  resources: Resource[];

  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}

@InputType()
export class ContentWarningInput {
  @Field({ nullable: true })
  name: string;
}
