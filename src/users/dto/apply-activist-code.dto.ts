import { Field, InputType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class ApplyActivistCodes {
  @Field()
  user: User;

  @Field()
  grades: string[];

  @Field()
  subjects: string[]
}
