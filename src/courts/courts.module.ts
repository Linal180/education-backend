import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Court } from "./entities/court.entity";
import { CourtToExternalUserToExternalUserRole } from "./entities/courtExternalUserToExternalUserRole.entity";
import { CourtsResolver } from "./resolvers/courts.resolver";
import { CourtsService } from "./services/courts.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Court, CourtToExternalUserToExternalUserRole]),
  ],
  providers: [CourtsResolver, CourtsService],
  exports: [TypeOrmModule, CourtsService],
})
export class CourtsModule { }
