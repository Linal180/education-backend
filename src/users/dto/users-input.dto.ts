import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import PaginationInput from '../../pagination/dto/pagination-input.dto';
import { UserRole } from '../entities/role.entity';
import { UserStatus } from '../entities/user.entity';

@InputType()
export default class UsersInput {
  @Field((type) => String, { nullable: true })
  from?: string;

  @Field((type) => String, { nullable: true })
  to?: string;

  @Field((type) => UserStatus, { nullable: true })
  status?: UserStatus;

  @Field((type) => [UserRole], { nullable: true })
  roles?: UserRole[];

  @Field((type) => PaginationInput)
  paginationOptions: PaginationInput;
}
