import { Field, InputType, OmitType, PickType, registerEnumType } from '@nestjs/graphql';
import { SchoolType } from '../../organizations/entities/organization.entity';
import { OrganizationInput } from '../../organizations/dto/organization-input.dto';
import { Country } from '../entities/user.entity';
import { SocialProvider } from "../../util/interfaces"

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

  @Field({ nullable: true })
  googleId?: string;

  @Field({ nullable: true })
  microsoftId?: string;

  @Field(type => Country, { nullable: true })
  country: Country;

  @Field(() => SchoolType, { nullable: true })
  category?: SchoolType

  @Field({ nullable: true })
  zip?: string;

  @Field(() => [String], { nullable: 'items' })
  // @ArrayNotEmpty({message:"subjectArea is not empty"})
  subjectAreas: string[];

  @Field(type => [String], { nullable: 'items' })
  grades: string[];

  @Field(type => OrganizationInput, { nullable: true })
  organization?: OrganizationInput;

  @Field(() => Boolean, { defaultValue: true })
  nlnOpt: boolean;

  @Field(() => Boolean, { defaultValue: false })
  siftOpt: boolean;

  @Field(() => Boolean, { defaultValue: false })
  isMissing?: boolean;
}



registerEnumType(SocialProvider, {
  name: 'Provider',
  description: 'The OAuth providers to register or signIn',
});
@InputType()
export class OAuthProviderInput {
  @Field({ nullable: false })
  token: string
}

@InputType()
export class socialAuthInput extends OAuthProviderInput {
  @Field((type) => SocialProvider)
  provider: SocialProvider
}

@InputType()
export class RegisterWithGoogleInput extends OmitType(RegisterUserInput, ['email', 'password'] as const) {
  @Field({ nullable: false })
  token: string
}

@InputType()
export class RegisterWithMicrosoftInput extends OmitType(RegisterUserInput , ['email' , 'password'] as const) {
  @Field({nullable: false})
  token: string
}
