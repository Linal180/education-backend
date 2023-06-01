import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Prerequisite, PrerequisiteInput } from "./entities/prerequisite.entity";
import { Repository } from "typeorm";

@Injectable()
export class PrerequisiteService {
    constructor(
        @InjectRepository(Prerequisite)
        private readonly prerequisiteRepository: Repository<Prerequisite>
    ){ }

    async findOneAndCreate(prerequisiteInput:PrerequisiteInput):Promise<Prerequisite>{
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
                const validPrerequisite = await this.findOneAndCreate(prerequisite)
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
}