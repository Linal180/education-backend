import { InjectRepository } from "@nestjs/typeorm";
import { AssessmentTypeInput } from "./dto/assessment-type-input.dto";
import { AssessmentType } from "./entities/assessment-type.entity";
import { FindManyOptions, FindOneOptions, In, Repository } from "typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class AssessmentTypeService {
  constructor(
    @InjectRepository(AssessmentType)
    private assessmentTypeRepository: Repository<AssessmentType>,
  ){}

  async findOneOrCreate(assessmentTypeInput:AssessmentTypeInput):Promise<AssessmentType>{
    try{
      const { name } = assessmentTypeInput;
      const assessmentType = await this.findOne({ where: { name }} );
      if(!assessmentType){
        return await this.create({ name });
      }
      return assessmentType
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findAllByNameOrCreate(assessmentTypes:AssessmentTypeInput[]):Promise<AssessmentType[]>{
    try{
      const newAssessmentTypes = []
      for(let assessmentType of assessmentTypes){ 
          const newAssessmentType = new AssessmentTypeInput()
          newAssessmentType.name = (assessmentType.name ? assessmentType.name : assessmentType) as string
          const validAssessmentType = await this.findOneOrCreate(newAssessmentType)
          if(validAssessmentType){
              newAssessmentTypes.push(validAssessmentType) 
          }
      }
      return newAssessmentTypes
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findAllByIds(ids: string[]): Promise<AssessmentType[]>{
    try{
      const assessmentTypes = await this.assessmentTypeRepository.find({ where: { id: In(ids) } });
      return assessmentTypes 
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findAllByName(): Promise<string[]> {
    try{
      const assessmentTypes = await this.assessmentTypeRepository.find({
        select: ['name'],
      });
      return assessmentTypes.map(assessmentType => assessmentType.name) || [] ;
    }
    catch(error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createAssessmentType(assessmentType: AssessmentType): Promise<AssessmentType> {
    try{
      return await this.assessmentTypeRepository.save(assessmentType);
    }
    catch(error) {
      throw new InternalServerErrorException(error);
    }

  }

  
  /**
   * 
   * @returns 
   */  
  async getAllAssessmentTypes(): Promise<AssessmentType[]> {
    try{
      return await this.findMany({
        relations: ["resources"],
      }) || [] ;
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 
   * @returns 
   */
  async getAssessmentTypeById(id: string): Promise<AssessmentType | null > {
    try{
      return await this.findOne({
        where: { id },
        relations: ["resources"],
      }) || null;
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }
  /**
   * 
   * @param filter 
   * @returns 
   */
  async findOne(filter: FindOneOptions<AssessmentType>): Promise<AssessmentType | null>{
    try{
      const classRoomNeed = await this.assessmentTypeRepository.findOne(filter) as AssessmentType;
      return classRoomNeed || null;
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 
   * @param filter 
   * @returns 
   */
  async findMany(filter: FindManyOptions<AssessmentType>): Promise<AssessmentType[]>{
    try{
      return await this.assessmentTypeRepository.find(filter) || [];
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async create(assessmentType: Partial<AssessmentType>): Promise<AssessmentType | null > {
    try{
      const { name, ...rest } = assessmentType;
      if (!name) {
        return null
      }
      const newAssessmentType = this.assessmentTypeRepository.create({ name, ...rest });
      const savedAssessmentType = await this.assessmentTypeRepository.save(newAssessmentType);
      return savedAssessmentType || null;
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }
}