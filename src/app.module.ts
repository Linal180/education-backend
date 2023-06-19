import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { DatabaseConfig } from './database.config';
import { PaginationModule } from './pagination/pagination.module';
import { UsersModule } from './users/users.module';
import { ResourcesModule } from './resources/resources.module';
import { UtilsModule } from './util/utils.module';
import { AwsCognitoModule } from './cognito/cognito.module';
import { CronsModule } from './cron/crons.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    UsersModule,
    OrganizationsModule,
    PaginationModule,
    UtilsModule,
    AwsCognitoModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      // autoSchemaFile: 'schema.gql',
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
      introspection: true,
      playground: true,
      driver: ApolloDriver,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    ResourcesModule,
    // CronsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
