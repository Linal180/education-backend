import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
CreateDateColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Role } from './role.entity';

import { Grade } from '../../resources/entities/grade-levels.entity';
import { SubjectArea } from '../../resources/entities/subject-areas.entity';
import { Organization } from './organization.entity';

export enum UserStatus {
  DEACTIVATED = 0,
  ACTIVE,
}

registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: 'The user status',
});

@Entity({ name: 'Users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.DEACTIVATED,
  })
  @Field((type) => UserStatus)
  status: UserStatus;

  @Column({ nullable: true, default: false })
  @Field()
  emailVerified: boolean;

  @Column()
  password: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Field((type) => [Role], { nullable: 'itemsAndList' })
  @ManyToMany((type) => Role, (role) => role.users, { eager: true })
  @JoinTable({ name: 'UserRoles' })
  roles: Role[];

  @Column({ nullable : true})
  @Field({ nullable: true})
  country: string;



  @Field(type => [Grade], { nullable: 'itemsAndList' })
  @ManyToMany(type => Grade, grade => grade.users, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  gradeLevel: Grade[];

  @Field((type) => [SubjectArea] , {nullable: 'itemsAndList'})
  @ManyToMany(type => SubjectArea, subjectArea => subjectArea.users, { onUpdate: 'CASCADE' , onDelete: "CASCADE"})
  subjectArea: SubjectArea[];

  @Field((type) => [Organization] , {nullable: 'itemsAndList'})
  @OneToMany(type => Organization , organization => organization.user , { onUpdate: 'CASCADE' , onDelete: 'SET NULL'} )
  organizations: Organization[];

  @Column({ nullable: true, default: false })
  @Field()
  newsLitNationAcess: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  updatedAt: string;

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
