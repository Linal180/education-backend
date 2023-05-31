import { InjectRepository } from "@nestjs/typeorm";
import { ContentWarning, ContentWarningInput  ,   } from "./entities/content-warning.entity";
import { Repository } from "typeorm";
import { InternalServerErrorException } from "@nestjs/common";



export class ContentWarningsService {
    constructor(
        @InjectRepository(ContentWarning)
        private readonly contentWarningRepository: Repository<ContentWarning>
    ) { }

    async findOneAndCreate(contentWarningInput:ContentWarningInput):Promise<ContentWarning>{
        try{
            const { name } = contentWarningInput;
            const contentWarning = this.contentWarningRepository.findOne({ where: { name } });
            if(!contentWarning){
                const contentWarningInstance = await this.contentWarningRepository.create({ name });
                return await this.contentWarningRepository.save(contentWarningInstance);
            }
            return contentWarning
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }
}