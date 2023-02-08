import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { ObjectType, Field } from "@nestjs/graphql";
import { CourtToExternalUserToExternalUserRole } from "./courtExternalUserToExternalUserRole.entity";

@Entity({ name: "Courts" })
@ObjectType()
export class Court {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  courtCode: string;

  @Column()
  @Field()
  chiefAdmin: string;

  @Column()
  @Field()
  mvcCode: string;

  @Column("date", { nullable: true })
  @Field({ nullable: true })
  openTime: string;

  @Column("date", { nullable: true })
  @Field({ nullable: true })
  closeTime: string;

  @Column()
  @Field()
  phoneNumber: string;

  @Column()
  @Field()
  county: string;

  @Column()
  @Field()
  municipality: string;

  @OneToMany(
    (type) => CourtToExternalUserToExternalUserRole,
    (courtToExternalUserToExternalUserRole) =>
      courtToExternalUserToExternalUserRole.court
  )
  @Field((type) => [CourtToExternalUserToExternalUserRole], {
    nullable: "itemsAndList",
  })
  courtToExternalUserToExternalUserRole: CourtToExternalUserToExternalUserRole[];

  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}
