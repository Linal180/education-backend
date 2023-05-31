import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NlpStandard } from "./entities/nlp-standard.entity";
import { NlpStandardsService } from "./nlp-standard.service";





@Module({
    imports: [TypeOrmModule.forFeature([NlpStandard])],
    providers:[NlpStandardsService],
    exports:[TypeOrmModule , NlpStandardsService],

})
export class NlpStandardsModule {}