import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NLNOTopNavigation, NLNOTopNavigationInput } from "./entities/nlno-top-navigation.entity";
import { Repository } from "typeorm";

@Injectable()
export class NLNOTopNavigationsService {
    constructor(
        @InjectRepository(NLNOTopNavigation)
        private readonly NLNOTopNavigationRepository: Repository<NLNOTopNavigation>
    ){ }

    async findOneAndCreate(nlnoTopNavigationInput:NLNOTopNavigationInput):Promise<NLNOTopNavigation>{
        try{
            const { name } = nlnoTopNavigationInput;
            const NLNOTopNavigation = this.NLNOTopNavigationRepository.findOne({ where: { name } });
            if(!NLNOTopNavigation){
                const NLNOTopNavigationInstance = this.NLNOTopNavigationRepository.create({ name });
                return await this.NLNOTopNavigationRepository.save(NLNOTopNavigationInstance);
            }
            return NLNOTopNavigation
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }
}