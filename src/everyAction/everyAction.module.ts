import { Module, forwardRef } from '@nestjs/common';
import { EveryActionService } from './everyAction.service';
import { UsersModule } from 'src/users/users.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { UserEveryActionModule } from 'src/userEveryActon/userEveryAction.module';
import { UsersService } from 'src/users/users.service';
import { userEveryActionService } from 'src/userEveryActon/userEveryAction.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // forwardRef(() => UsersModule ),
    // UsersModule,
    HttpModule,
    OrganizationsModule,
    UserEveryActionModule
  ],
  providers: [EveryActionService],
  exports: [EveryActionService],
})

export class EveryActionModule { }
