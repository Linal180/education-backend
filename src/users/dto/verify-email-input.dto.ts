import { Field, InputType, PickType } from '@nestjs/graphql';
import { ResetPasswordInput } from './reset-password-input.dto';
import { socialProvider } from 'src/util/interfaces';

@InputType()
export class VerifyEmailInput extends PickType(ResetPasswordInput, ['token'] as const) { }

@InputType()
export class CheckUserAlreadyExistsInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  provider?: socialProvider
}