import { Field, ObjectType } from "@nestjs/graphql";
import { Resource } from "../../resources/entities/resource.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "MediaOutletsMentioned" })
@ObjectType()
export class MediaOutletsMentioned {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @ManyToMany(type => Resource, resource => resource.mediaOutletMentionds, { onUpdate: 'CASCADE', onDelete: "CASCADE" })
  @JoinTable({ name: 'ResourcesMediaOutletsMentiond' })
  resources: Resource[];

  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}