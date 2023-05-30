import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubjectArea } from "./entities/subject-areas.entity";


@Module({
    imports:[TypeOrmModule.forFeature([SubjectArea])],
    providers:[],
    exports:[TypeOrmModule]
})
export class subjectAreasModule{}