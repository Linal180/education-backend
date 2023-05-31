import { InjectRepository } from "@nestjs/typeorm";
import { ContentLink , linksToContentInput} from "./entities/content-link.entity";
import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class ContentLinksService {
    constructor(
        @InjectRepository(ContentLink)
        private readonly contentLinkRepository: Repository<ContentLink>
    ) { }

    async findOneAndCreate(linksToContentInput:linksToContentInput):Promise<ContentLink>{
        try{
            const { name } = linksToContentInput;
            const contentLink = this.contentLinkRepository.findOne({ where: { name } });
            if(!contentLink){
                const contentLinkInstance = await this.contentLinkRepository.create({ name });
                return await this.contentLinkRepository.save(contentLinkInstance);
            }
            return contentLink
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAll() {
        return await this.contentLinkRepository.find({});
    }

    async findById(id) {
        return await this.contentLinkRepository.findOne({ where: { id } });
    }


}