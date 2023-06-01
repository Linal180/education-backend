import { InjectRepository } from "@nestjs/typeorm";
import { EvaluationPreference , EvaluationPreferenceInput } from "./entities/evaluation-preference.entity";
import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class EvaluationPreferenceService {
    constructor(
        @InjectRepository(EvaluationPreference)
        private readonly evaluationPreferenceRepository : Repository<EvaluationPreference>
    ) { }

    async findOneOrCreate(evaluationPreferenceInput:EvaluationPreferenceInput):Promise<EvaluationPreference>{
        try{
            const { name } = evaluationPreferenceInput;
            const evaluationPreference = this.evaluationPreferenceRepository.findOne({ where: { name } });
            if(!evaluationPreference){
                const evaluationPreferenceInstance = this.evaluationPreferenceRepository.create({ name });
                return await this.evaluationPreferenceRepository.save(evaluationPreferenceInstance) || null;
            }
            return evaluationPreference
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByNameOrCreate(evaluationPreferences:EvaluationPreferenceInput[]):Promise<EvaluationPreference[]>{
        try{
            const newEvaluationPreferences = []
            for(let evaluationPreference of evaluationPreferences){ 
                const validEvaluationPreference = await this.findOneOrCreate(evaluationPreference)
                if(validEvaluationPreference){
                    newEvaluationPreferences.push(validEvaluationPreference) 
                }
            }
            return newEvaluationPreferences
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }
}