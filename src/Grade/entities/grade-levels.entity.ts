import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {
  Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Resource } from "../../resources/entities/resource.entity";
import {User} from "../../users/entities/user.entity";


@Entity({ name: "Grades" })
@ObjectType()
export class Grade {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({nullable : true})
  recordId: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @ManyToMany(type => Resource, resource => resource.gradeLevel, { onUpdate: 'CASCADE', onDelete: "CASCADE" })
  @JoinTable({ name: 'ResourcesGrades' })
  resources: Resource[];

  @ManyToMany((type) => User, (user) => user)
  users: User[];

  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}

@InputType()
export class GradeInput {
  @Field({ nullable: true })
  name: string;
}
