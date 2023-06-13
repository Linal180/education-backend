import { Module, forwardRef } from '@nestjs/common';
import { EveryActionService } from './everyAction.service';
import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule ),
    // UsersModule,
    HttpModule,
    OrganizationsModule,
  ],
  providers: [EveryActionService],
  exports: [EveryActionService],
})

export class EveryActionModule { }
