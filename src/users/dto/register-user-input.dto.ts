import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from '../entities/role.entity';
import { SubjectArea } from 'src/resources/entities/subject-areas.entity';
import { Grade } from 'src/resources/entities/grade-levels.entity';
import { Organization } from '../entities/organization.entity';
import { OrganizationUserInput } from './organization-user-input.dto';

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

  @Field({nullable : true})
  country: string;

  @Field(() => [String], { nullable: true })
  subjectArea: string[];

  @Field(type => [String] , {nullable : 'itemsAndList'})
  grade: string[];

  @Field(type => [OrganizationUserInput] , {nullable: 'itemsAndList' })
  organization: OrganizationUserInput[];

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
  @Field({ nullable: true })
  phoneNumber: string;
  @Field((type) => UserRole, {
    description: 'Send User Type from the ENUM - Sign-up',
  })
  roleType: UserRole;
}
