import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NlpStandard } from "./entities/nlp-standard.entity";
import { NlpStandardService } from "./nlp-standard.service";

@Module({
	imports: [TypeOrmModule.forFeature([NlpStandard])],
	providers:[NlpStandardService],
	exports:[TypeOrmModule , NlpStandardService],
})
export class NlpStandardModule {}