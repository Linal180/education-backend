import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class StripeInput {
  @Field()
  token: string;

  @Field()
  amount: number;
}
