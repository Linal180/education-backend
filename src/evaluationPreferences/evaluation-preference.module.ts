import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EvaluationPreference } from "./entities/evaluation-preference.entity";
import { EvaluationPreferenceService } from "./evaluation-preference.service";

@Module({
  imports: [TypeOrmModule.forFeature([EvaluationPreference])],
  providers: [EvaluationPreferenceService],
  exports: [TypeOrmModule, EvaluationPreferenceService],
})
export class EvaluationPreferenceModule { }