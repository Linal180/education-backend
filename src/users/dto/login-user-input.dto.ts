import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@InputType()
export class LoginSsoUserInput {
  @Field()
  token: string;
}
