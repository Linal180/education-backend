import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Prerequisite } from "./entities/prerequisite.entity";
import { PrerequisiteService } from "./prerequisite.service";

@Module({
  imports: [TypeOrmModule.forFeature([Prerequisite])],
  providers: [PrerequisiteService],
  exports: [TypeOrmModule, PrerequisiteService],
})
export class PrerequisitesModule { }