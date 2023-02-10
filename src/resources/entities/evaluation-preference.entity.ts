import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {
  Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Resource } from "./resource.entity";

@Entity({ name: "EvaluationPreferences" })
@ObjectType()
export class EvaluationPreference {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @ManyToMany(type => Resource, resource => resource.evaluationPreference, { onUpdate: 'CASCADE', onDelete: "CASCADE" })
  @JoinTable({ name: 'ResourcesEvaluationPreferences' })
  resources: Resource[];

  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}

@InputType()
export class EvaluationPreferenceInput {
  @Field({ nullable: true })
  name: string;
}
