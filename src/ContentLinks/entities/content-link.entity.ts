import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Resource } from "../../resources/entities/resource.entity";

@Entity({ name: "ContentLinks" })
@ObjectType()
export class ContentLink {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({ nullable : true })
  recordId: string;
  
  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  url: string;

  @Field(() => Resource, { nullable: true })
  @ManyToOne(() => Resource, resource => resource.linksToContent, { onUpdate: 'CASCADE', onDelete: "CASCADE" })
  resource: Resource;

  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}

@InputType()
export class LinksToContentInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  url: string;
}