import { InjectRepository } from "@nestjs/typeorm";
import { Journalist, JournalistInput } from "./entities/journalist.entity";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Repository } from "typeorm";


@Injectable()
export class JournalistsService {
    constructor(
        @InjectRepository(Journalist)
        private readonly journalistRepository: Repository<Journalist>
    ) 
    {}

    async findOneAndCreate(journalistInput:JournalistInput):Promise<Journalist>{
        try{
            const { name } = journalistInput;
            const journalist = this.journalistRepository.findOne({ where: { name } });
            if(!journalist){
                const journalistInstance = this.journalistRepository.create({ name });
                return await this.journalistRepository.save(journalistInstance);
            }
            return journalist
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

}