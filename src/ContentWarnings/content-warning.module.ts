import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContentWarning } from "./entities/content-warning.entity";
import { ContentWarningService } from "./content-warning.service";




@Module({
    imports: [TypeOrmModule.forFeature([ContentWarning])],
    providers:[ContentWarningService],
    exports:[TypeOrmModule , ContentWarningService],

})
export class ContentWarningModule {}

