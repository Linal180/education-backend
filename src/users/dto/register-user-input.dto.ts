import { Field, InputType, OmitType, PickType } from '@nestjs/graphql';
import { schoolType } from '../../organizations/entities/organization.entity';
import { OrganizationInput } from '../../organizations/dto/organization-input.dto';
import { Country } from '../entities/user.entity';
import { Role, UserRole } from '../entities/role.entity';

@InputType()
export class RegisterUserInput {
  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: false })
  password: string;
  
  @Field()
  email: string;

  @Field(type => Country , {nullable : true})
  country: Country;
   
  @Field( () => schoolType , {nullable: true})
  category?: schoolType

  @Field({nullable: true})
  zip?: string;
  
  @Field(() => [String], { nullable: 'items' })
  // @ArrayNotEmpty({message:"subjectArea is not empty"})
  subjectAreas: string[];

  @Field(type => [String] , {nullable : 'items'})
  grades: string[];

  @Field(type => OrganizationInput , {nullable: true })
  organization?: OrganizationInput;

  @Field(()=> Boolean,{ defaultValue : true})
  nlnOpt : boolean;

  @Field(()=>Boolean , { defaultValue: false})
  siftOpt: boolean;
}

@InputType()
export class RegisterWithGoogleInput extends PickType(RegisterUserInput , ['email' , 'firstName' , 'lastName'] as const) {
  @Field(type => UserRole , { nullable: true })
  role?: UserRole

  @Field({nullable: true})
  token: string

}

@InputType()
export class RegisterWithMicrosoftInput extends RegisterWithGoogleInput {}
