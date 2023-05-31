import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClassRoomNeed, ClassRoomNeedInput } from "./entities/classroom-needs.entity";
import { Repository } from "typeorm";

@Injectable()
export class ClassRoomNeedsService {
    constructor(
        @InjectRepository(ClassRoomNeed)
        private classRoomNeedRepository: Repository<ClassRoomNeed>,
    ) { }

    async findOneAndCreate(classRoomNeedInput:ClassRoomNeedInput):Promise<ClassRoomNeed>{
        try{
            const { name } = classRoomNeedInput;
            const classRoomNeed = await this.classRoomNeedRepository.findOne({ where: { name }} );
            if(!classRoomNeed){
                const classRoomNeedInstance = await this.classRoomNeedRepository.create({ name });
                return await this.classRoomNeedRepository.save(classRoomNeedInstance);
            }
            return classRoomNeed
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