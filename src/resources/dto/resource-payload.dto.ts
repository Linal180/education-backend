import { Field, ObjectType } from '@nestjs/graphql';
import { ResponsePayload, ResponsePayloadResponse } from 'src/users/dto/response-payload.dto';
import { Resource } from '../entities/resource.entity';

@ObjectType()
export class ResourcePayload  extends ResponsePayloadResponse{
  @Field({ nullable: true })
  resource: Resource;

  @Field({ nullable: true })
  response?: ResponsePayload;
}
