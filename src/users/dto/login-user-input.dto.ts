import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field({nullable: true})
  email?: string;

  @Field({nullable: true})
  username?: string;
  
  @Field()
  password: string;
}

@InputType()
export class LoginSsoUserInput {
  @Field()
  token: string;
}
