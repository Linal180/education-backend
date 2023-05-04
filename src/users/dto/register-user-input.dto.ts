import { Field, FieldMiddleware, InputType, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { UserRole } from '../entities/role.entity';
import { SubjectArea } from 'src/resources/entities/subject-areas.entity';
import { Grade } from 'src/resources/entities/grade-levels.entity';
import { Organization } from '../entities/organization.entity';
import { OrganizationUserInput } from './organization-user-input.dto';
import { ArrayNotEmpty } from 'class-validator';

const subjectAreaMiddleware: FieldMiddleware = (ctx, next) =>{
  console.log("<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log('ctx', ctx)
  console.log("<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>");
}

const loggerMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();
  console.log("<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log('value', value)
  console.log("<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  return value;
};

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

  @Field({nullable : true})
  country: string;
  
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
