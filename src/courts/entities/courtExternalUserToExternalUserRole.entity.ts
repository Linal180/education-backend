import { Field, ObjectType } from "@nestjs/graphql";

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Court } from "./court.entity";

@Entity({ name: "CourtToExternalUser" })
@ObjectType()
export class CourtToExternalUserToExternalUserRole {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column()
  @Field()
  courtId!: string;

  @Column()
  @Field()
  externalUserToExternalUserRoleId!: string;

  @Column({ nullable: true, default: false })
  @Field()
  isArchived: boolean;

  @Column("date", { nullable: true })
  @Field({ nullable: true })
  isArchivedAt: string;

  @ManyToOne(() => Court, (court) => court.courtToExternalUserToExternalUserRole)
  @Field((type) => Court)
  court!: Court;

  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}
