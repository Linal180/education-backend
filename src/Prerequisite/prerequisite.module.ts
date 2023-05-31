import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Prerequisite } from "./entities/prerequisite.entity";
import { PrerequisitesService } from "./prerequisite.service";





@Module({
    imports: [TypeOrmModule.forFeature([Prerequisite])],
    providers:[PrerequisitesService],
    exports:[TypeOrmModule , PrerequisitesService],

})
export class PrerequisitesModule {}