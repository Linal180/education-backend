import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NLNOTopNavigation, NLNOTopNavigationInput } from "./entities/nlno-top-navigation.entity";
import { Repository } from "typeorm";

@Injectable()
export class NLNOTopNavigationService {
    constructor(
        @InjectRepository(NLNOTopNavigation)
        private readonly NLNOTopNavigationRepository: Repository<NLNOTopNavigation>
    ){ }

    async findOneOrCreate(nlnoTopNavigationInput:NLNOTopNavigationInput):Promise<NLNOTopNavigation>{
        try{
            const { name } = nlnoTopNavigationInput;
            const NLNOTopNavigation = this.NLNOTopNavigationRepository.findOne({ where: { name } });
            if(!NLNOTopNavigation){
                const NLNOTopNavigationInstance = this.NLNOTopNavigationRepository.create({ name });
                return (await this.NLNOTopNavigationRepository.save(NLNOTopNavigationInstance)) || null;
            }
            return NLNOTopNavigation
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByNameOrCreate(nlnoTopNavigations:NLNOTopNavigationInput[]):Promise<NLNOTopNavigation[]>{
        try{
            const newNlnoTopNavigations = []
            for(let nlnoTopNavigation of nlnoTopNavigations){ 
                const result = await this.findOneOrCreate(nlnoTopNavigation)
                if(result){
                    newNlnoTopNavigations.push(result)
                }
            }
            return newNlnoTopNavigations
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }
}