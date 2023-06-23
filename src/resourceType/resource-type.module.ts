import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ResourceType } from "./entities/resource-types.entity";
import { ResourceTypeService } from "./resource-type.service";

@Module({
  imports: [TypeOrmModule.forFeature([ResourceType])],
  providers: [ResourceTypeService],
  exports: [TypeOrmModule, ResourceTypeService],
})
export class ResourceTypeModule { }