import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: "wordWallTerms" })
@ObjectType()
export class WordWallTerms {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({nullable: true})
  @Field({nullable: true})
  name: string

  @CreateDateColumn({ type: "timestamptz" })
  @Field()  
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}