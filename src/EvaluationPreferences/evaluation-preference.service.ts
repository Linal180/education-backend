import { InjectRepository } from "@nestjs/typeorm";
import { EvaluationPreference , EvaluationPreferenceInput } from "./entities/evaluation-preference.entity";
import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class EvaluationPreferencesService {
    constructor(
        @InjectRepository(EvaluationPreference)
        private readonly evaluationPreferenceRepository : Repository<EvaluationPreference>
    ) { }

    async findOneAndCreate(evaluationPreferenceInput:EvaluationPreferenceInput):Promise<EvaluationPreference>{
        try{
            const { name } = evaluationPreferenceInput;
            const evaluationPreference = this.evaluationPreferenceRepository.findOne({ where: { name } });
            if(!evaluationPreference){
                const evaluationPreferenceInstance = this.evaluationPreferenceRepository.create({ name });
                return await this.evaluationPreferenceRepository.save(evaluationPreferenceInstance);
            }
            return evaluationPreference
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }
}