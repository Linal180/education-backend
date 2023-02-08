import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateResourceInput } from "../dto/resource-input.dto";
import { UpdateResourceInput } from "../dto/update-resource.input";
import { Resource } from "../entities/resource.entity";

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
  ) { }


  /**
   * Creates resource service
   * @param createResourceInput 
   * @returns create 
   */
  // async create(createResourceInput: CreateResourceInput): Promise<Resource> {
  //   try {
  //     const resourceInput = this.resourcesRepository.create(createResourceInput)
  //     return await this.resourcesRepository.save(resourceInput);
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }
/**
 * Updates resources service
 * @param updateResourceInput 
 * @returns update 
 */
async update(updateResourceInput: UpdateResourceInput): Promise<Resource> {
    const { id } = updateResourceInput
    try {
      await this.resourcesRepository.update(id, { ...updateResourceInput });
      return  await this.resourcesRepository.findOneBy({ id }) 
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

/**
 * Finds one
 * @param id 
 * @returns one 
 */
async findOne(id: string): Promise<Resource> {
    return await this.resourcesRepository.findOne({ where: { id } });
}

/**
 * Removes resource
 * @param id 
 */
async removeResource(id) {
    try {
      await this.resourcesRepository.delete(id)
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}
