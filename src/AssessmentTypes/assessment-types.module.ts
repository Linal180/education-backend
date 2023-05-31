import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssessmentType } from './entities/assessment-type.entity'
import { AssessmentTypesService } from "./assessment-types.service";



@Module({
    imports: [TypeOrmModule.forFeature([AssessmentType])],
    providers:[AssessmentTypesService],
    exports:[TypeOrmModule, AssessmentTypesService],

})
export class AssessmentTypesModule {}