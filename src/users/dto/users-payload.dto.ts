import { ObjectType, Field, Int, PickType, OmitType } from '@nestjs/graphql';
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

@ObjectType()
export class currentUser extends OmitType(User, ['awsAccessToken', 'awsRefreshToken','awsSub'] as const){}

@ObjectType()
export class currentUserPayload  extends PickType(UsersPayload , ['pagination' , 'response'] as const){
  @Field(type => currentUser, { nullable: true })
  user: currentUser;
}
