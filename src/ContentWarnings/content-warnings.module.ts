import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContentWarning } from "./entities/content-warning.entity";
import { ContentWarningsService } from "./content-warnings.service";




@Module({
    imports: [TypeOrmModule.forFeature([ContentWarning])],
    providers:[ContentWarningsService],
    exports:[TypeOrmModule , ContentWarningsService],

})
export class ContentWarningsModule {}

