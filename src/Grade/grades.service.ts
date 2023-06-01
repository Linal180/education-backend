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
                return await this.gradeRepository.save(gradeInstance) || null
            }
            return grade;
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByNameOrCreate(grades:GradeInput[]):Promise<Grade[]>{
        try{
            const newGrades = []
            for(let grade of grades){ 
                const validGrade = await this.findOneOrCreate(grade)
                if(validGrade){
                    newGrades.push(validGrade) 
                }
            }
            return newGrades
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    
}