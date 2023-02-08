import { Field, ObjectType } from '@nestjs/graphql';
import { ResponsePayload, ResponsePayloadResponse } from 'src/users/dto/response-payload.dto';
import { Court } from '../entities/court.entity';

@ObjectType()
export class CourtPayload  extends ResponsePayloadResponse{
  @Field({ nullable: true })
  court: Court;

  @Field({ nullable: true })
  response?: ResponsePayload;
}
