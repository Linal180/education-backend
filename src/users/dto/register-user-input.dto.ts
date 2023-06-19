import { Field, FieldMiddleware, InputType, MiddlewareContext, NextFn, OmitType } from '@nestjs/graphql';
import { UserRole } from '../entities/role.entity';
import { SubjectArea } from '../../subjectArea/entities/subject-areas.entity';
import { Grade } from '../../grade/entities/grade-levels.entity';
import { Organization, schoolType } from '../../organizations/entities/organization.entity';
import { OrganizationInput } from '../../organizations/dto/organization-input.dto';
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
   
  @Field( () => schoolType , {nullable: true})
  category?: schoolType

  @Field({nullable: true})
  zip?: string;
  
  @Field(() => [String], { nullable: 'items' })
  // @ArrayNotEmpty({message:"subjectArea is not empty"})
  subjectArea: string[];

  @Field(type => [String] , {nullable : 'items'})
  // @ArrayNotEmpty()
  grade: string[];

  @Field(type => OrganizationInput , {nullable: true })
  // @ArrayNotEmpty({message:"Organization is not empty"})
  organization?: OrganizationInput;

  @Field(()=> Boolean,{ defaultValue : true})
  nlnOpt : boolean;

  @Field(()=>Boolean , { defaultValue: false})
  siftOpt: boolean;
  
  @Field((type) => UserRole, {
    description: 'Send Investor Type from the ENUM - Sign-up',
  })
  roleType: UserRole;
}

@InputType()
export class RegisterSsoUserInput extends OmitType(RegisterUserInput , ['awsSub' ,'email'] as const )  {
    
  @Field()
  token: string;
  
}
