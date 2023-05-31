import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewsLiteracyTopic, NewsLiteracyTopicInput } from "./entities/newliteracy-topic.entity";
import { Repository } from "typeorm";

@Injectable()
export class NewsLiteracyTopicsService {
    constructor(
        @InjectRepository(NewsLiteracyTopic)
        private readonly newsLiteracyTopicRepository: Repository<NewsLiteracyTopic>
    ) { }

    async findOneAndCreate(newsLiteracyTopicInput:NewsLiteracyTopicInput):Promise<NewsLiteracyTopic>{
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
}