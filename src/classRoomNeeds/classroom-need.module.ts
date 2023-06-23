import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassRoomNeed } from "./entities/classroom-needs.entity";
import { ClassRoomNeedService } from "./classroom-need.service";

@Module({
  imports: [TypeOrmModule.forFeature([ClassRoomNeed])],
  providers: [ClassRoomNeedService],
  exports: [TypeOrmModule, ClassRoomNeedService],
})
export class ClassRoomNeedModule { }