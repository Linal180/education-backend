import { InjectRepository } from "@nestjs/typeorm";
import { EvaluationPreference } from "./entities/evaluation-preference.entity";
import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { EvaluationPreferenceInput } from "./dto/evaluation-preference.input.dto";

@Injectable()
export class EvaluationPreferenceService {
  constructor(
    @InjectRepository(EvaluationPreference)
    private readonly evaluationPreferenceRepository : Repository<EvaluationPreference>
  ) {}

  async findOneOrCreate(evaluationPreferenceInput:EvaluationPreferenceInput):Promise<EvaluationPreference>{
    try{
      const { name } = evaluationPreferenceInput;
      const evaluationPreference = await this.evaluationPreferenceRepository.findOne({ where: { name } });
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
        const newEvaluationPreferenceInput = new EvaluationPreferenceInput()
        newEvaluationPreferenceInput.name = (evaluationPreference.name ? evaluationPreference.name : evaluationPreference) as string        
        const validEvaluationPreference = await this.findOneOrCreate(newEvaluationPreferenceInput)
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

  async findAllByName(): Promise<string[]> {
    try{
      const evaluationPreferences = await this.evaluationPreferenceRepository.find({
        select: ['name'],
      });
      return evaluationPreferences.map(evaluationPreference => evaluationPreference.name) || [];
    }
    catch(error) {
      throw new InternalServerErrorException(error);
    }
  }
}