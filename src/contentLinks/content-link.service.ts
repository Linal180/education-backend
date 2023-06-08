import { InjectRepository } from "@nestjs/typeorm";
import { ContentLink , LinksToContentInput} from "./entities/content-link.entity";
import { FindManyOptions, FindOneOptions, In, Repository } from "typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class ContentLinkService {
  constructor(
    @InjectRepository(ContentLink)
    private readonly contentLinkRepository: Repository<ContentLink>
  ){}

  async findOneOrCreate(linksToContentInput:LinksToContentInput):Promise<ContentLink | null>{
    try{
      const { name , url } = linksToContentInput;
      if(!name){
        return null;
      }
      const contentLink = await this.findOne({ where: { name } });
      if(!contentLink){
        return await this.create({ name  , url }) ;
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

  async findAllByIds(ids: string[]): Promise<ContentLink[]>{
    try{
      return await this.contentLinkRepository.find({ where: { id: In(ids) } }) || [];
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findAllByName(): Promise<string[]> {
    try{
      const contentLinks = await this.findMany({
        select: ['name'],
      });
      return ( contentLinks.map(contentLink => contentLink.name) || [] );
    }
    catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll():Promise<ContentLink[]> {
    try{
      return await this.contentLinkRepository.find({}) || [];
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(id: string):Promise<ContentLink> {
    try{
      return await this.contentLinkRepository.findOne({ where: { id } }) || null;
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(filter: FindOneOptions<ContentLink>): Promise<ContentLink | null>{
    try{
      return await this.contentLinkRepository.findOne(filter) as ContentLink  || null;
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findMany(filter: FindManyOptions<ContentLink>): Promise<ContentLink[]>{
    try{
      return await this.contentLinkRepository.find(filter) || [];
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async create(contentLink: Partial<ContentLink>): Promise<ContentLink | null > {
    try{
      const { name, url ,...rest } = contentLink;
      const contentLinkInstance = this.contentLinkRepository.create({ name, url, ...rest });
      const savedContentLink = await this.contentLinkRepository.save(contentLinkInstance);
      return savedContentLink || null;
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }


}