import { Module } from '@nestjs/common';
import { EveryActionService } from './everyAction.service';

@Module({
  providers: [EveryActionService],
  exports: [EveryActionService],
})

export class EveryActionModule { }
