import { ObjectType, Field, Int } from '@nestjs/graphql';
import PaginationPayload from '../../pagination/dto/pagination-payload.dto';
import { User } from '../entities/user.entity';

import { ResponsePayload } from './response-payload.dto';

@ObjectType()
export class UsersPayload {
  @Field(type => [User], { nullable: 'itemsAndList' })
  users: User[];

  @Field(type => PaginationPayload, { nullable: true })
  pagination?: PaginationPayload

  @Field({ nullable: true })
  response?: ResponsePayload
}
