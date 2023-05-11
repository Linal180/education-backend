import { Field, FieldMiddleware, InputType, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { UserRole } from '../entities/role.entity';
import { SubjectArea } from 'src/resources/entities/subject-areas.entity';
import { Grade } from 'src/resources/entities/grade-levels.entity';
import { Organization } from '../entities/organization.entity';
import { OrganizationUserInput } from './organization-user-input.dto';
import { ArrayNotEmpty } from 'class-validator';
import { Country } from '../entities/user.entity';

@InputType()
export class RegisterUserInput {
  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  password: string;
  
  @Field()
  email: string;

  @Field()
  awsSub: string;
  
  @Field(type => Country , {nullable : true})
  country: Country;
  
  @Field(() => [String], { nullable: 'items' })
  // @ArrayNotEmpty({message:"subjectArea is not empty"})
  subjectArea: string[];

  @Field(type => [String] , {nullable : 'items'})
  // @ArrayNotEmpty()
  grade: string[];

  @Field(type => OrganizationUserInput , {nullable: true })
  // @ArrayNotEmpty({message:"Organization is not empty"})
  organization: OrganizationUserInput;

  @Field(()=> Boolean,{ defaultValue : false})
  newsLitNationAcess : boolean;

  
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
  
  @Field((type) => UserRole, {
    description: 'Send User Type from the ENUM - Sign-up',
  })
  roleType: UserRole;

  @Field(type => Country ,{nullable : true})
  country: Country;

  @Field(() => [String], { nullable: true })
  subjectArea: string[];

  @Field(type => [String] , {nullable : 'itemsAndList'})
  grade: string[];

  @Field(type => OrganizationUserInput , {nullable: true })
  organization: OrganizationUserInput;

  @Field(()=> Boolean,{ defaultValue : false})
  newsLitNationAcess : boolean;
}
