import { Module, forwardRef } from '@nestjs/common';
import { EveryActionService } from './everyAction.service';
import { UsersModule } from 'src/users/users.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { OrganizationsModule } from 'src/organizations/organizations.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    HttpModule,
    OrganizationsModule,
  ],
  providers: [EveryActionService],
  exports: [EveryActionService],
})

export class EveryActionModule { }
