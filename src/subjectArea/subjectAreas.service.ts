import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SubjectArea, SubjectAreaInput } from "./entities/subject-areas.entity";
import { In, Repository } from "typeorm";



@Injectable()
export class subjectAreasService {
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
                return await this.subjectAreaRepository.save(subjectAreaInstance);
            }
            return subjectArea;

        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }
}