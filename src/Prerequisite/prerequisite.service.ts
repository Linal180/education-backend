import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Prerequisite, PrerequisiteInput } from "./entities/prerequisite.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class PrerequisiteService {
    constructor(
        @InjectRepository(Prerequisite)
        private readonly prerequisiteRepository: Repository<Prerequisite>
    ){ }

    async findOneOrCreate(prerequisiteInput:PrerequisiteInput):Promise<Prerequisite>{
        try{
            const { name  } = prerequisiteInput;
            const prerequisite = this.prerequisiteRepository.findOne({ where: { name } });
            if(!prerequisite){
                const PrerequisiteInstance = this.prerequisiteRepository.create({ name  });
                return await this.prerequisiteRepository.save(PrerequisiteInstance);
            }
            return prerequisite
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByNameOrCreate(prerequisites:PrerequisiteInput[]):Promise<Prerequisite[]>{
        try{
            const newPrerequisites = []
            for(let prerequisite of prerequisites){ 
                const validPrerequisite = await this.findOneOrCreate(prerequisite)
                if(validPrerequisite){
                    newPrerequisites.push(validPrerequisite)
                }
            }
            return newPrerequisites
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByIds<T>(ids: string[]): Promise<T[]>{
        try{
            const assessmentTypes = await this.prerequisiteRepository.find({ where: { id: In(ids) } });
            return assessmentTypes as T[]
        }
        catch(error){
          throw new InternalServerErrorException(error);
        }
    }

    async findAllDistinctByName(): Promise<string[]> {
        try{
            const prerequisites = await this.prerequisiteRepository.find({
                select: ['name'],
            });
            const distinctPrerequisites = Array.from(new Set(prerequisites.map(prerequisite => prerequisite.name)));
            return distinctPrerequisites
        }
        catch(error) {
            throw new InternalServerErrorException(error);
        }
    }


}