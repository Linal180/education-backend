import { Field, InputType, PickType, registerEnumType } from '@nestjs/graphql';
import { ResetPasswordInput } from './reset-password-input.dto';
import { socialAuthInput } from './register-user-input.dto';

@InputType()
export class VerifyEmailInput extends PickType(ResetPasswordInput, ['token'] as const) { }

@InputType()
export class CheckUserAlreadyExistsInput {
  @Field({ nullable: true })
  email?: string;

  @Field((type) => socialAuthInput ,{ nullable: true })
  socailLogin?: socialAuthInput
}