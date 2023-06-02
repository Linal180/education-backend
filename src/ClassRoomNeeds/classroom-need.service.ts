import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClassRoomNeed, ClassRoomNeedInput } from "./entities/classroom-needs.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class ClassRoomNeedService {
    constructor(
        @InjectRepository(ClassRoomNeed)
        private classRoomNeedRepository: Repository<ClassRoomNeed>,
    ) { }

    async findOneOrCreate(classRoomNeedInput:ClassRoomNeedInput):Promise<ClassRoomNeed>{
        try{
            const { name } = classRoomNeedInput;
            const classRoomNeed = await this.classRoomNeedRepository.findOne({ where: { name }} );
            if(!classRoomNeed){
                const classRoomNeedInstance = this.classRoomNeedRepository.create({ name });
                return await this.classRoomNeedRepository.save(classRoomNeedInstance) || null;
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
                const validClassRoomNeed = await this.findOneOrCreate(classRoomNeed)
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

    async findAllByIds<T>(ids: string[]): Promise<T[]>{
        try{
            const assessmentTypes = await this.classRoomNeedRepository.find({ where: { id: In(ids) } });
            return assessmentTypes as T[]
        }
        catch(error){
          throw new InternalServerErrorException(error);
        }
    }

    async findAllDistinctByName(): Promise<string[]> {
        try{
            const classRoomNeeds = await this.classRoomNeedRepository.find({
                select: ['name'],
            });
            const distinctClassRoomNeeds = Array.from(new Set(classRoomNeeds.map(classRoomNeed => classRoomNeed.name)));
            return distinctClassRoomNeeds
        }
        catch(error) {
            throw new InternalServerErrorException(error);
        }
    }


    async create(classRoomNeed: ClassRoomNeed): Promise<ClassRoomNeed> {
        return await this.classRoomNeedRepository.save(classRoomNeed);
    }

    async findAll(): Promise<ClassRoomNeed[]> {
        return await this.classRoomNeedRepository.find();
    }

    async findById(id: string): Promise<ClassRoomNeed> {
        return await this.classRoomNeedRepository.findOne({where:{ id }});
    }
    async update(classRoomNeed: ClassRoomNeed): Promise<ClassRoomNeed> {
        return await this.classRoomNeedRepository.save(classRoomNeed);
    }
}