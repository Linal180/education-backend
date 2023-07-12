import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export default class PaginationInput {
  @Field(type => Int)
  page: number

  @Field(type => Int)
  limit: number
}