import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClassRoomNeed, ClassRoomNeedInput } from "./entities/classroom-needs.entity";
import { Repository } from "typeorm";

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