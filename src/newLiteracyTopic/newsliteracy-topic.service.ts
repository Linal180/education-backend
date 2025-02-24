import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewsLiteracyTopic } from "./entities/newliteracy-topic.entity";
import { FindManyOptions, Repository , In } from "typeorm";
import { NewsLiteracyTopicInput } from "./dto/newsliteracy-topic.input.dto";

@Injectable()
export class NewsLiteracyTopicService {
  constructor(
    @InjectRepository(NewsLiteracyTopic)
    private readonly newsLiteracyTopicRepository: Repository<NewsLiteracyTopic>
  ){}

  /**
   * @description
   * @param newsLiteracyTopicInput 
   * @returns 
   */
  async findOneOrCreate(newsLiteracyTopicInput:NewsLiteracyTopicInput):Promise<NewsLiteracyTopic>{
    try{
      const { name } = newsLiteracyTopicInput;
      const newsLiteracyTopic =await this.newsLiteracyTopicRepository.findOne({ where: { name } });
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

  /**
   * @description
   * @param newsLiteracyTopics 
   * @returns 
   */
  async findAllByNameOrCreate(newsLiteracyTopics:NewsLiteracyTopicInput[]):Promise<NewsLiteracyTopic[]>{
    try{
      const newNewsLiteracyTopic = []
      for(let newsLiteracyTopic of newsLiteracyTopics){ 
        const newNewsLiteracyTopicInput = new NewsLiteracyTopicInput()
        newNewsLiteracyTopicInput.name = (newsLiteracyTopic.name ? newsLiteracyTopic.name : newsLiteracyTopic) as string
        const validNewsLiteracyTopic = await this.findOneOrCreate(newNewsLiteracyTopicInput)
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

  /**
   * @description
   * @returns 
   */
  async findAllByName(): Promise<string[]> {
    try{
      const newsLiteracyTopics = await this.newsLiteracyTopicRepository.find({
        select: ['name'],
      });
      return (newsLiteracyTopics.map(newsLiteracyTopic => newsLiteracyTopic.name)) || [];
    }
    catch(error) {
      throw new InternalServerErrorException(error);
    }
  }


  /**
   * @description Find classRoomNeeds on the base of the classRoomNeed ids array
   * @param ids 
   * @returns  the classRoomNeeds array if found or empty array if not found
   */
  async findAllByIds(ids: string[] | null): Promise<NewsLiteracyTopic[]> {
    try {
      if(!ids){
        return [];
      }
      return await this.findMany({ where: { id: In(ids) } }) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

   /**
   * @description find a classRoomNedd on the base of filters
   * @param filter 
   * @returns the classRoomNedd arrray or empty array if no classRoomNedd is found
   */
   async findMany(filter: FindManyOptions<NewsLiteracyTopic>): Promise<NewsLiteracyTopic[]> {
    try {
      return await this.newsLiteracyTopicRepository .find(filter) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  
}