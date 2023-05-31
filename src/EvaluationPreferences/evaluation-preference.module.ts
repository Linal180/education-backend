import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EvaluationPreference } from "./entities/evaluation-preference.entity";
import { EvaluationPreferencesService } from "./evaluation-preference.service";




@Module({
    imports: [TypeOrmModule.forFeature([EvaluationPreference])],
    providers:[EvaluationPreferencesService],
    exports:[TypeOrmModule , EvaluationPreferencesService],

})
export class EvaluationPreferencesModule {}