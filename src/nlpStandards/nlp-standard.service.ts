import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NlpStandard, NlpStandardInput } from "./entities/nlp-standard.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class NlpStandardService {
    constructor(
        @InjectRepository(NlpStandard)
        private readonly nlpStandardRepository: Repository<NlpStandard>
    ){ }

    async findOneOrCreate(nlpStandardInput:NlpStandardInput):Promise<NlpStandard>{
        try{
            const { name , description } = nlpStandardInput;
            const NlpStandard = this.nlpStandardRepository.findOne({ where: { name } });
            if(!NlpStandard){
                const NlpStandardInstance = this.nlpStandardRepository.create({ name , description });
                return await this.nlpStandardRepository.save(NlpStandardInstance);
            }
            return NlpStandard
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByNameOrCreate(nlpStandards:NlpStandardInput[] ):Promise<NlpStandard[]>{
        try{
            const newNlpStandards = []
            for(let nlpStandard of nlpStandards){ 
                const validNlpStandard = await this.findOneOrCreate(nlpStandard)
                if(validNlpStandard){
                    newNlpStandards.push(validNlpStandard)
                }
            }
            return newNlpStandards
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByIds<T>(ids: string[]): Promise<T[]>{
        try{
            const nlpStandards = await this.nlpStandardRepository.find({ where: { id: In(ids) } });
            return nlpStandards as T[]
        }
        catch(error){
          throw new InternalServerErrorException(error);
        }
    }

    async findAllDistinctByName(): Promise<string[]> {
        try{
            const nlpStandards = await this.nlpStandardRepository.find({
                select: ['name'],
            });
            const distinctNlpStandards = Array.from(new Set(nlpStandards.map(nlpStandard => nlpStandard.name)));
            return distinctNlpStandards
        }
        catch(error) {
            throw new InternalServerErrorException(error);
        }
    }
}