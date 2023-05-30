import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassRoomNeed } from "./entities/classroom-needs.entity";



@Module({
    imports: [TypeOrmModule.forFeature([ClassRoomNeed])],
    providers:[],
    exports:[TypeOrmModule],

})
export class AssessmentTypesModule {}