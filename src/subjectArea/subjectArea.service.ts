import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SubjectArea, SubjectAreaInput } from "./entities/subject-areas.entity";
import { In, Repository } from "typeorm";



@Injectable()
export class SubjectAreaService {
    constructor(
        @InjectRepository(SubjectArea)
        private subjectAreaRepository: Repository<SubjectArea>,
    ){}

    async findOneOrCreate(subjectAreaInput: SubjectAreaInput):Promise<SubjectArea> {
        try{
            const { name } = subjectAreaInput;
            const subjectArea = await this.subjectAreaRepository.findOne({ where: { name }});
            if(!subjectArea){
                const subjectAreaInstance = this.subjectAreaRepository.create({ name }) ;
                return await this.subjectAreaRepository.save(subjectAreaInstance) || null;
            }
            return subjectArea;

        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByNameOrCreate(SubjectAreas:SubjectAreaInput[]):Promise<SubjectArea[]>{
        try{
            const newSubjectAreas = []
            for(let subjectArea of SubjectAreas){ 
                const validSubjectArea = await this.findOneOrCreate(subjectArea)
                if(validSubjectArea){
                    newSubjectAreas.push(validSubjectArea) 
                }
            }
            return newSubjectAreas
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByIds<T>(ids: string[]): Promise<T[]>{
        try{
            const assessmentTypes = await this.subjectAreaRepository.find({ where: { id: In(ids) } });
            return assessmentTypes as T[]
        }
        catch(error){
          throw new InternalServerErrorException(error);
        }
    }

    async findAllDistinctByName(): Promise<string[]> {
        try{
            const subjectAreas = await this.subjectAreaRepository.find({
                select: ['name'],
            });
            const distinctSubjectAreas = Array.from(new Set(subjectAreas.map(subjectArea => subjectArea.name)));
            return distinctSubjectAreas
        }
        catch(error) {
            throw new InternalServerErrorException(error);
        }
    }


}