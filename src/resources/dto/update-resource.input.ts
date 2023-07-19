import { InputType, Field, PartialType, PickType } from '@nestjs/graphql';
import { CreateResourceInput } from './resource-input.dto';

@InputType()
export class UpdateResourceInput extends PartialType(CreateResourceInput) {
  @Field()
  id: string;

  @Field()
  slug: string;
}



@InputType()
export class RemoveResource extends PickType(UpdateResourceInput, ['id'] as const) { }

@InputType()
export class GetResource extends PickType(UpdateResourceInput, ['slug'] as const) { }

