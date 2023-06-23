import { Field, ObjectType } from "@nestjs/graphql";
import { Resource } from "../../resources/entities/resource.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "MediaOutletsFeatured" })
@ObjectType()
export class MediaOutletsFeatured {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string

  @ManyToMany(type => Resource, resource => resource.mediaOutletFeatureds, { onUpdate: 'CASCADE', onDelete: "CASCADE" })
  @JoinTable({ name: 'ResourcesMediaOutletsFeatured' })
  resources: Resource[];

  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}