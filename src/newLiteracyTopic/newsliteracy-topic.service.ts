import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewsLiteracyTopic, NewsLiteracyTopicInput } from "./entities/newliteracy-topic.entity";
import { Repository } from "typeorm";

@Injectable()
export class NewsLiteracyTopicService {
    constructor(
        @InjectRepository(NewsLiteracyTopic)
        private readonly newsLiteracyTopicRepository: Repository<NewsLiteracyTopic>
    ) { }

    async findOneOrCreate(newsLiteracyTopicInput:NewsLiteracyTopicInput):Promise<NewsLiteracyTopic>{
        try{
            const { name } = newsLiteracyTopicInput;
            const newsLiteracyTopic = this.newsLiteracyTopicRepository.findOne({ where: { name } });
            if(!newsLiteracyTopic){
                const newsLiteracyTopicInstance = this.newsLiteracyTopicRepository.create({ name });
                return await this.newsLiteracyTopicRepository.save(newsLiteracyTopicInstance);
            }
            return newsLiteracyTopic
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByNameOrCreate(newsLiteracyTopics:NewsLiteracyTopicInput[]):Promise<NewsLiteracyTopic[]>{
        try{
            const newNewsLiteracyTopic = []
            for(let newsLiteracyTopic of newsLiteracyTopics){ 
                const validNewsLiteracyTopic = await this.findOneOrCreate(newsLiteracyTopic)
                if(validNewsLiteracyTopic){
                    newNewsLiteracyTopic.push(validNewsLiteracyTopic)
                }
            }
            return newNewsLiteracyTopic
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }
}