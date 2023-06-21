import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SubjectArea } from "./entities/subject-areas.entity";
import { In, Repository } from "typeorm";
import { SubjectAreaInput } from "./dto/subject-area.input.dto";

@Injectable()
export class SubjectAreaService {
  constructor(
    @InjectRepository(SubjectArea)
    private subjectAreaRepository: Repository<SubjectArea>,
  ) { }

  /**
   * @description
   * @param subjectAreaInput
   * @returns 
   */
  async findOneOrCreate(subjectAreaInput: SubjectAreaInput): Promise<SubjectArea | null> {
    try {
      const { name } = subjectAreaInput;
      if (!name) return null;
      const subjectArea = await this.subjectAreaRepository.findOne({ where: { name } });
      if (!subjectArea) {
        const subjectAreaInstance = this.subjectAreaRepository.create({ name });
        return await this.subjectAreaRepository.save(subjectAreaInstance) || null;
      }
      return subjectArea;
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param SubjectAreas 
   * @returns 
   */
  async findAllByNameOrCreate(SubjectAreas: SubjectAreaInput[]): Promise<SubjectArea[]> {
    try {
      const newSubjectAreas = []
      for (let subjectArea of SubjectAreas) {
        const newSubjectAreaInput = new SubjectAreaInput()
        newSubjectAreaInput.name = (subjectArea.name ? subjectArea.name : subjectArea) as string
        const validSubjectArea = await this.findOneOrCreate(newSubjectAreaInput)
        if (validSubjectArea) {
          newSubjectAreas.push(validSubjectArea)
        }
      }
      return newSubjectAreas
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param ids 
   * @returns 
   */
  async findAllByIds(ids: string[] | null): Promise<SubjectArea[]> {
    try {
      console.log("ids: ",ids)
      if(!ids){
        return [];
      }
      return await this.subjectAreaRepository.find({ where: { id: In(ids) } }) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @returns 
   */
  async findAllByName(): Promise<string[]> {
    try {
      const subjectAreas = await this.subjectAreaRepository.find({
        select: ['name'],
      });
      return (subjectAreas.map(subjectArea => subjectArea.name)) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}