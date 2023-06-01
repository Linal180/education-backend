import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssessmentType } from './entities/assessment-type.entity'
import { AssessmentTypeService } from "./assessment-type.service";



@Module({
    imports: [TypeOrmModule.forFeature([AssessmentType])],
    providers:[AssessmentTypeService],
    exports:[TypeOrmModule, AssessmentTypeService],

})
export class AssessmentTypeModule {}