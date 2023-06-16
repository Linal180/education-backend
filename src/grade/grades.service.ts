import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Grade } from "./entities/grade-levels.entity";
import { In, Repository } from "typeorm";
import { GradeInput } from "./dto/grade-level.input.dto";

@Injectable()
export class GradesService{
  constructor(
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
  ){} 

  async findOneOrCreate(gradeInput: GradeInput): Promise<Grade | null>{
    try{
      const { name }  = gradeInput;
      if(!name) return null;
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
        const newGrade = new GradeInput()
        newGrade.name = (grade.name ? grade.name : grade) as string
        const validGrade = await this.findOneOrCreate(newGrade)
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

  async findAllByIds(ids: string[]): Promise<Grade[]>{
    try{
      return await this.gradeRepository.find({ where: { id: In(ids) } }) || [];
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findAllByName(): Promise<string[]> {
    try{
      const grades = await this.gradeRepository.find({
        select: ['name'],
      });
      return grades.map(grade => grade.name) || [] ;
    }
    catch(error) {
      throw new InternalServerErrorException(error);
    }
  }  
}