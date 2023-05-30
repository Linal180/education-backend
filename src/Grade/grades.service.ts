import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Grade, GradeInput } from "./entities/grade-levels.entity";
import { Repository } from "typeorm";

@Injectable()
export class GradesService{
    constructor(
        @InjectRepository(Grade)
        private gradeRepository: Repository<Grade>,
    ){} 

    async findOneOrCreate(gradeInput: GradeInput): Promise<Grade>{
        try{
            const { name }  = gradeInput;
            const grade = await this.gradeRepository.findOne({ where: { name }});
            if(!grade){
                const gradeInstance = this.gradeRepository.create({name})
                return await this.gradeRepository.save(gradeInstance)
            }
            return grade;
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    
}