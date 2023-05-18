import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./entities/organization.entity";
import { PaginationModule } from "src/pagination/pagination.module";
import { HttpModule } from "@nestjs/axios";
import { OrganizationsResolver } from "./organizations.resolver";
import { JwtStrategy } from "src/users/auth/jwt.strategy";
import { UserSubscriber } from "src/users/subscribers/user.subscriber";
import { UsersService } from "src/users/users.service";
import { OrganizationsService } from "./organizations.service";
import { OrganizationsController } from "./organizations.controller";



@Module({
    imports: [
      TypeOrmModule.forFeature([ Organization ]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
    //   JwtModule.registerAsync({
    //     useFactory: async (configService: ConfigService) => ({
    //       secret: configService.get('JWT_SECRET'),
    //       signOptions: { expiresIn: configService.get('JWT_EXPIRY') },
    //     }),
    //     inject: [ConfigService],
    //   }),
      HttpModule,
      PaginationModule,
    //   AwsCognitoModule,
    ],
    providers: [OrganizationsService, OrganizationsResolver, JwtStrategy ],
    controllers: [OrganizationsController],
    exports: [OrganizationsService, TypeOrmModule],
  })

  export class OrganizationsModule {}
