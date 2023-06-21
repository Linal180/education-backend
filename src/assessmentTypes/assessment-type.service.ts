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
  ) { }

  /**
   * @description find the assessment type or  create a new one if it doesn't exist in the repository.
   * @param assessmentTypeInput 
   * @returns the assessment type or null if it doesn't exist in the repository
   */
  async findOneOrCreate(assessmentTypeInput: AssessmentTypeInput): Promise<AssessmentType> {
    try {
      const { name } = assessmentTypeInput;
      const assessmentType = await this.findOne({ where: { name } });
      if (!assessmentType) {
        return await this.create({ name });
      }
      return assessmentType
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description find the assessment types by name 
   * @param assessmentTypes 
   * @returns the assessment types or empty array if no assessment types are found
   */
  async findByNameOrCreate(assessmentTypes: AssessmentTypeInput[]): Promise<AssessmentType[]> {
    try {
      const newAssessmentTypes = []
      for (let assessmentType of assessmentTypes) {
        const newAssessmentType = new AssessmentTypeInput()
        newAssessmentType.name = (assessmentType.name ? assessmentType.name : assessmentType) as string
        const validAssessmentType = await this.findOneOrCreate(newAssessmentType)
        if (validAssessmentType) {
          newAssessmentTypes.push(validAssessmentType)
        }
      }
      return newAssessmentTypes || []
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description Find assessment types on the base of the assessment ids array
   * @param ids 
   * @returns  the assessment types array if found or empty array if not found
   */
  async findAllByIds(ids: string[] | null): Promise<AssessmentType[]> {
    try {
      if(!ids){
        return []
      }
      return await this.assessmentTypeRepository.find({ where: { id: In(ids) } }) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description Get all assessment types and return a list of assessment types names
   * @returns assessment types names array
   */
  async findAllByName(): Promise<string[]> {
    try {
      const assessmentTypes = await this.assessmentTypeRepository.find({
        select: ['name'],
      });
      return assessmentTypes.map(assessmentType => assessmentType.name) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description This method is used to retrieve first one assessement type based on the the conditions
   * @param filter 
   * @returns the first one assessement type based on the conditions or return null
   */
  async findOne(filter: FindOneOptions<AssessmentType>): Promise<AssessmentType | null> {
    try {
      const classRoomNeed = await this.assessmentTypeRepository.findOne(filter) as AssessmentType;
      return classRoomNeed || null;
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description find all assessment types based on the filter parameters and return a list of assessment types or null if not found
   * @param filter 
   * @returns array of assessment types or null if not found
   */
  async findMany(filter: FindManyOptions<AssessmentType>): Promise<AssessmentType[]> {
    try {
      return await this.assessmentTypeRepository.find(filter) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description create a new assessment type on the base of the assessment type name if  it exist it will be added to the assessment type
   * @param assessmentType 
   * @returns 
   */
  async create(assessmentType: Partial<AssessmentType>): Promise<AssessmentType | null> {
    try {
      const { name, ...rest } = assessmentType;
      if (!name) {
        return null
      }
      const newAssessmentType = this.assessmentTypeRepository.create({ name, ...rest });
      const savedAssessmentType = await this.assessmentTypeRepository.save(newAssessmentType);
      return savedAssessmentType || null;
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}