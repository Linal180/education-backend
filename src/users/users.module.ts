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
import { AwsCognitoModule } from '../cognito/cognito.module';
import { HttpModule } from '@nestjs/axios';
import { OrganizationsModule } from '../organizations/organizations.module';
import { EveryActionModule } from '../everyAction/everyAction.module';
import { GradesModule } from '../grade/grades.module';
import { SubjectAreaModule } from '../subjectArea/subjectArea.module';
import { MailerModule } from '../mailer/mailer.module';
import { GoogleAuthModule } from '../googleAuth/googleAuth.module';
import { MicrosoftAuthModule } from '../microsoftAuth/microsoftAuth.module';
import { CustomUserController } from './api.user.controller';
// import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRY') },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    MailerModule,
    PaginationModule,
    AwsCognitoModule,
    // RedisModule,
    GoogleAuthModule,
    MicrosoftAuthModule,
    OrganizationsModule,
    EveryActionModule,
    GradesModule,
    SubjectAreaModule
  ],
  providers: [UsersService, UsersResolver, JwtStrategy, UserSubscriber],
  controllers: [UsersController , CustomUserController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule { }