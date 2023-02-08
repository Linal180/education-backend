import { InputType, Field, PartialType, PickType } from '@nestjs/graphql';
import { CreateCourtInput } from './court-input.dto';

@InputType()
export class UpdateCourtInput extends PartialType(CreateCourtInput) {
  @Field()
  id: string;
}
@InputType()
export class RemoveCourt extends PickType(UpdateCourtInput, ['id'] as const) { }

@InputType()
export class GetCourt extends PickType(UpdateCourtInput, ['id'] as const) { }

