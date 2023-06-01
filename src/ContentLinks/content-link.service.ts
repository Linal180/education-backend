import { InjectRepository } from "@nestjs/typeorm";
import { ContentLink , LinksToContentInput} from "./entities/content-link.entity";
import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class ContentLinkService {
    constructor(
        @InjectRepository(ContentLink)
        private readonly contentLinkRepository: Repository<ContentLink>
    ) { }

    async findOneOrCreate(linksToContentInput:LinksToContentInput):Promise<ContentLink>{
        try{
            const { name , url } = linksToContentInput;
            const contentLink = this.contentLinkRepository.findOne({ where: { name } });
            if(!contentLink){
                const contentLinkInstance = this.contentLinkRepository.create({ name  , url });
                return await this.contentLinkRepository.save(contentLinkInstance) || null;
            }
            return contentLink
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByNameOrCreate(contentLinks:LinksToContentInput[]):Promise<ContentLink[]>{
        try{
            const newContentLinks = []
            for(let content of contentLinks){ 
                const result = await this.findOneOrCreate(content)
                if(result){
                    newContentLinks.push(result) 
                }
            }
            return newContentLinks
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }


    async findAll() {
        return await this.contentLinkRepository.find({});
    }

    async findById(id: string) {
        return await this.contentLinkRepository.findOne({ where: { id } });
    }


}