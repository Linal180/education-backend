import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubjectArea } from "./entities/subject-areas.entity";
import { SubjectAreaService } from "./subjectArea.service";

@Module({
    imports:[TypeOrmModule.forFeature([SubjectArea])],
    providers:[SubjectAreaService],
    exports:[TypeOrmModule , SubjectAreaService]
})
export class SubjectAreaModule{}