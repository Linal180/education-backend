import { InjectRepository } from "@nestjs/typeorm";
import { AssessmentType, AssessmentTypeInput } from "./entities/assessment-type.entity";
import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class AssessmentTypesService {
    constructor(
        @InjectRepository(AssessmentType)
        private assessmentRepository: Repository<AssessmentType>,
    )
    { }

    async findOneAndCreate(assessmentTypeInput:AssessmentTypeInput):Promise<AssessmentType>{
        try{
            const { name } = assessmentTypeInput;
            const assessmentType = await this.assessmentRepository.findOne({ where: { name }} );
            if(!assessmentType){
                const assessmentTypeInstance = await this.assessmentRepository.create({ name });
                return await this.assessmentRepository.save(assessmentTypeInstance);
            }
            return assessmentType
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async createAssessmentType(assessmentType: AssessmentType): Promise<AssessmentType> {
        return await this.assessmentRepository.save(assessmentType);
    }
    
    async getAllAssessmentTypes(): Promise<AssessmentType[]> {
        return await this.assessmentRepository.find({
            relations: ["resources"],
        });
    }

    async getAssessmentTypeById(id: string): Promise<AssessmentType> {
        return await this.assessmentRepository.findOne({
            where: { id },
            relations: ["resources"],
        });
    }
}