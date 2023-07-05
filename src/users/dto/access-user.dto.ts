import { ObjectType, Field } from '@nestjs/graphql';
import { ResponsePayload } from './response-payload.dto';
import { Role } from '../entities/role.entity';

@ObjectType()
export class UserData {
  @Field()
  id: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  email: string;
}

@ObjectType()
export class AccessUserPayload {
  @Field({ nullable: true })
  access_token?: string;

  @Field((type) => [Role], { nullable: true })
  roles: Role[];

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  response?: ResponsePayload;
}
