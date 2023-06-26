import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Prerequisite } from "./entities/prerequisite.entity";
import { In, Repository } from "typeorm";
import { PrerequisiteInput } from "./dto/prerequisite.input.dto";

@Injectable()
export class PrerequisiteService {
  constructor(
    @InjectRepository(Prerequisite)
    private readonly prerequisiteRepository: Repository<Prerequisite>
  ) { }

  /**
   * @description
   * @param prerequisiteInput 
   * @returns 
   */
  async findOneOrCreate(prerequisiteInput: PrerequisiteInput): Promise<Prerequisite> {
    try {
      const { name } = prerequisiteInput;
      if (!name) {
        return null
      }
      const prerequisite = await this.prerequisiteRepository.findOne({ where: { name } });
      if (!prerequisite) {
        const PrerequisiteInstance = this.prerequisiteRepository.create({ name });
        return await this.prerequisiteRepository.save(PrerequisiteInstance);
      }
      return prerequisite
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param prerequisites 
   * @returns 
   */
  async findAllByNameOrCreate(prerequisites: PrerequisiteInput[]): Promise<Prerequisite[]> {
    try {
      const newPrerequisites = []
      for (let prerequisite of prerequisites) {
        const newPrerequisiteInput = new PrerequisiteInput()
        newPrerequisiteInput.name = (prerequisite.name ? prerequisite.name : prerequisite) as string
        const validPrerequisite = await this.findOneOrCreate(newPrerequisiteInput)
        if (validPrerequisite) {
          newPrerequisites.push(validPrerequisite)
        }
      }
      return newPrerequisites
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
  async findAllByIds(ids: string[]): Promise<Prerequisite[]> {
    try {
      return await this.prerequisiteRepository.find({ where: { id: In(ids) } }) || null;

    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @ description 
   * @returns 
   */
  async findAllByName(): Promise<string[]> {
    try {
      const prerequisites = await this.prerequisiteRepository.find({
        select: ['name'],
      });
      return (prerequisites.map(prerequisite => prerequisite.name)) || null;
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


}