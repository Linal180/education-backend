import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UserSubscriber } from './subscribers/user.subscriber';
import { ConfigService } from '@nestjs/config';
import { PaginationModule } from '../pagination/pagination.module';
import { AwsCognitoModule } from 'src/cognito/cognito.module';
import { Organization } from '../organizations/entities/organization.entity';
import { HttpModule } from '@nestjs/axios';
import { Grade } from 'src/resources/entities/grade-levels.entity';
import { SubjectArea } from 'src/resources/entities/subject-areas.entity';
// import { UserGrades } from './entities/UserGrades.entity';
// import { UsersSubjectAreas } from './entities/UsersSubjectAreas.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { OrganizationsModule } from 'src/organizations/organizations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role , Grade , SubjectArea ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRY') },
      }),
      inject: [ConfigService],
    }),

    HttpModule,
    PaginationModule,
    AwsCognitoModule,
    OrganizationsModule
  ],
  providers: [UsersService,  UsersResolver, JwtStrategy, UserSubscriber],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule { }