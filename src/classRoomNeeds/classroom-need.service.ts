import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClassRoomNeed } from "./entities/classroom-needs.entity";
import { FindManyOptions, FindOneOptions, In, Repository } from "typeorm";
import { ClassRoomNeedInput } from "./dto/classroom-need.input.dto";

@Injectable()
export class ClassRoomNeedService {
  constructor(
    @InjectRepository(ClassRoomNeed)
    private classRoomNeedRepository: Repository<ClassRoomNeed>,
  ) {}

  async findOneOrCreateClassRoomNeed(classRoomNeedInput:ClassRoomNeedInput):Promise<ClassRoomNeed | null>{
    try{
      const { name } = classRoomNeedInput;
      const classRoomNeed = await this.findOne({ where: { name }} );
      if(!classRoomNeed){
        return await this.create({ name });
      }
      return classRoomNeed
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findAllByNameOrCreate(classRoomNeeds:ClassRoomNeedInput[]):Promise<ClassRoomNeed[]>{
    try{
      const newClassRoomNeeds = []
      for(let classRoomNeed of classRoomNeeds){ 
        const newClassRoomNeed = new ClassRoomNeedInput()
        newClassRoomNeed.name = (classRoomNeed.name ? classRoomNeed.name : classRoomNeed) as string
        const validClassRoomNeed = await this.findOneOrCreateClassRoomNeed(newClassRoomNeed)
        if(validClassRoomNeed){
          newClassRoomNeeds.push(validClassRoomNeed) 
        }
      }
      return newClassRoomNeeds
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findAllByIds(ids: string[]): Promise<ClassRoomNeed[]>{
    try{
      return await this.findMany({ where: { id: In(ids) } }) || [];
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findAllByName(): Promise<string[]> {
    try{
      const classRoomNeeds = await this.findMany({
        select: ['name'],
      });
      return classRoomNeeds.map(classRoomNeed => classRoomNeed.name) || [];
    }
    catch(error) {
      throw new InternalServerErrorException(error);
    }
  }


  async create(classRoomNeed: Partial<ClassRoomNeed>): Promise<ClassRoomNeed | null > {
    try{
      const { name, ...rest } = classRoomNeed;
      if (!name) {
        return null
      }
      const newClassRoomNeed = this.classRoomNeedRepository.create({ name, ...rest });
      const savedClassRoomNeed = await this.classRoomNeedRepository.save(newClassRoomNeed);
      return savedClassRoomNeed || null;
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<ClassRoomNeed[]> {
    return await this.classRoomNeedRepository.find();
  }

  async findById(id: string): Promise<ClassRoomNeed> {
    return await this.findOne({where:{ id }});
  }

  async update(classRoomNeed: ClassRoomNeed): Promise<ClassRoomNeed> {
    return await this.classRoomNeedRepository.save(classRoomNeed);
  }

  async findOne(filter: FindOneOptions<ClassRoomNeed>): Promise<ClassRoomNeed | null>{
    try{
      const classRoomNeed = await this.classRoomNeedRepository.findOne(filter) as ClassRoomNeed;
      return classRoomNeed || null;
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findMany(filter: FindManyOptions<ClassRoomNeed>): Promise<ClassRoomNeed[]>{
    try{
      return await this.classRoomNeedRepository.find(filter) || [];
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

}