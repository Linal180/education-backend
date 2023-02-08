import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCourtInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  courtCode: string;

  @Field()
  chiefAdmin: string;

  @Field()
  mvcCode: string;

  @Field({ nullable: true })
  openTime: string;

  @Field({ nullable: true })
  closeTime: string;

  @Field()
  phoneNumber: string;

  @Field()
  county: string;

  @Field()
  municipality: string;

  @Field()
  externalUserId: string

  @Field()
  externalUserRoleId: string
}
