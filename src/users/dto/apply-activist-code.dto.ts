import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ApplyActivistCodes {
  @Field()
  userId: string;

  @Field()
  grades: string[];

  @Field()
  subjects: string[]
}
