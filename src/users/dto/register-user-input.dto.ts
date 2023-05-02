import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from '../entities/role.entity';

@InputType()
export class RegisterUserInput {
  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;
  @Field({ nullable: true })
  password: string;
  @Field({ nullable: true })
  phoneNumber: string;
  @Field()
  email: string;
  @Field((type) => UserRole, {
    description: 'Send Investor Type from the ENUM - Sign-up',
  })
  roleType: UserRole;
}

@InputType()
export class RegisterSsoUserInput {
  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;
  @Field()
  token: string;
  @Field({ nullable: true })
  phoneNumber: string;
  @Field((type) => UserRole, {
    description: 'Send User Type from the ENUM - Sign-up',
  })
  roleType: UserRole;
}
