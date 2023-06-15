import { InjectRepository } from "@nestjs/typeorm";
import { Journalist, JournalistInput } from "./entities/journalist.entity";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { In, Repository } from "typeorm";


@Injectable()
export class JournalistsService {
    constructor(
        @InjectRepository(Journalist)
        private readonly journalistRepository: Repository<Journalist>
    ) 
    {}

    async findOneOrCreate(journalistInput:JournalistInput):Promise<Journalist>{
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

    async findAllByNameOrCreate(journalists:JournalistInput[]):Promise<Journalist[]>{
        try{
            const contentLinks = []
            for(let journalist of journalists){ 
                contentLinks.push(await this.findOneOrCreate(journalist)) 
            }
            return contentLinks
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByIds<T>(ids: string[]): Promise<T[]>{
        try{
            const journalists = await this.journalistRepository.find({ where: { id: In(ids) } });
            return journalists as T[]
        }
        catch(error){
          throw new InternalServerErrorException(error);
        }
    }

    async findAllDistinctByName(): Promise<string[]> {
        try{
            const journalists = await this.journalistRepository.find({
                select: ['name'],
            });
            const distinctJournalists = Array.from(new Set(journalists.map(journalist => journalist.name)));
            return distinctJournalists
        }
        catch(error) {
            throw new InternalServerErrorException(error);
        }
    }

}