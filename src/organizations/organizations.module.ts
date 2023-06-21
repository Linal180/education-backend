import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./entities/organization.entity";
import { PaginationModule } from "src/pagination/pagination.module";
import { HttpModule } from "@nestjs/axios";
import { OrganizationsResolver } from "./organizations.resolver";
import { OrganizationsService } from "./organizations.service";
import { OrganizationsController } from "./organizations.controller";



@Module({
    imports: [
      TypeOrmModule.forFeature([ Organization ]),
      HttpModule,
      PaginationModule,
    ],
    providers: [OrganizationsService, OrganizationsResolver ],
    controllers: [OrganizationsController],
    exports: [OrganizationsService ],
  })

  export class OrganizationsModule {}
