import {
  ManyToMany,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { User } from './user.entity';

export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
  EDUCATOR = 'educator',
  STUDENT = 'student',
  PUBLIC_USER = 'publicUser'
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'The user role assigned',
});

@Entity({ name: 'Roles' })
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ nullable: true })
  @Field(() => UserRole)
  role: UserRole;

  @ManyToMany((type) => User, (user) => user.roles)
  users: User[];

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  updatedAt: string;
}
