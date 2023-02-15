import { Field, InputType, ObjectType } from '@nestjs/graphql';
import PaginationInput from 'src/pagination/dto/pagination-input.dto';
import PaginationPayload from 'src/pagination/dto/pagination-payload.dto';
import { ResponsePayload, ResponsePayloadResponse } from 'src/users/dto/response-payload.dto';
import { Resource } from '../entities/resource.entity';
import { ResourceFake } from './resource-fake-payload.dto';

@ObjectType()
export class ResourcePayload  extends ResponsePayloadResponse{
  @Field({ nullable: true })
  resource: Resource;

  @Field({ nullable: true })
  response?: ResponsePayload;
}


@ObjectType()
export class ResourceFakePayload  extends ResponsePayloadResponse{
  @Field({ nullable: true })
  resource: ResourceFake;

  @Field({ nullable: true })
  response?: ResponsePayload;
}


@ObjectType()
export class ResourcesPayload  extends ResponsePayloadResponse{
  @Field(type => [Resource], { nullable: 'itemsAndList' })
  resources: Resource[];

  @Field(type => PaginationPayload, { nullable: true })
  pagination?: PaginationPayload
}

@InputType()
export default class ResourceInput {
    @Field(type => PaginationInput)
    paginationOptions: PaginationInput

    @Field({ nullable: true })
    searchString?: string

    @Field({ nullable: true })
    mostRelevant?: string

    @Field({ nullable: true })
    orderBy?: string
    
    @Field({ nullable: true , defaultValue: true})
    alphabetic?: boolean
}
