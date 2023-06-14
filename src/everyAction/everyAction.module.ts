import { Module } from '@nestjs/common';
import { EveryActionService } from './everyAction.service';
import { HttpModule } from '@nestjs/axios';
import { OrganizationsModule } from '../organizations/organizations.module';


@Module({
  imports: [
    HttpModule,
    OrganizationsModule,
  ],
  providers: [EveryActionService],
  exports: [EveryActionService],
})

export class EveryActionModule { }
