import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassRoomNeed } from "./entities/classroom-needs.entity";
import { ClassRoomNeedsService } from "./classroom-needs.service";



@Module({
    imports: [TypeOrmModule.forFeature([ClassRoomNeed])],
    providers:[ClassRoomNeedsService],
    exports:[TypeOrmModule , ClassRoomNeedsService],

})
export class ClassRoomNeedsModule {}