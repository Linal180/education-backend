import { Module } from '@nestjs/common';
import { EveryActionService } from './everyAction.service';
import { OrganizationsModule } from '../organizations/organizations.module';


@Module({
  imports: [
    OrganizationsModule,
  ],
  providers: [EveryActionService],
  exports: [EveryActionService],
})

export class EveryActionModule { }
