import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubjectArea } from "./entities/subject-areas.entity";
import { subjectAreasService } from "./subjectAreas.service";

@Module({
    imports:[TypeOrmModule.forFeature([SubjectArea])],
    providers:[subjectAreasService],
    exports:[TypeOrmModule , subjectAreasService]
})
export class subjectAreasModule{}