import { Field, InputType, OmitType } from '@nestjs/graphql';
import { UserRole } from '../entities/role.entity';
import { schoolType } from '../../organizations/entities/organization.entity';
import { OrganizationInput } from '../../organizations/dto/organization-input.dto';
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

  @Field((type) => Boolean , {defaultValue: false} )
  siftOpt:boolean;
  
  @Field((type) => UserRole, {
    description: 'Send Investor Type from the ENUM - Sign-up',
  })
  roleType: UserRole;
}

@InputType()
export class RegisterSsoUserInput  extends OmitType(RegisterUserInput, ['awsSub' , 'email'] ){

  @Field()
  token: string;
}
