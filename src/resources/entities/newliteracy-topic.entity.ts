import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {
  Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Resource } from "./resource.entity";

@Entity({ name: "NewsLiteracyTopics" })
@ObjectType()
export class NewsLiteracyTopic {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;
  
  @Column({nullable : true})
  recordId: string;
  
  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @ManyToMany(type => Resource, resource => resource.newsLiteracyTopic, { onUpdate: 'CASCADE', onDelete: "CASCADE" })
  @JoinTable({ name: 'ResourcesNewsLiteracyTopics' })
  resources: Resource[];

  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}

@InputType()
export class NewsLiteracyTopicInput {
  @Field({ nullable: true })
  name: string;
}
