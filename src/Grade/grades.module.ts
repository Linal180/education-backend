import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Grade } from "./entities/grade-levels.entity";
import { GradesService } from "./grades.service";


@Module({
    imports: [TypeOrmModule.forFeature([Grade])],
    providers:[GradesService],
    exports:[TypeOrmModule,GradesService],

})
export class GradesModule {}