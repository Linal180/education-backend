import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResourceType } from "./entities/resource-types.entity";
import { In, Repository } from "typeorm";
import { ResourceTypeInput } from "./dto/resource-type.input.dto";

@Injectable()
export class ResourceTypeService {
  constructor(
    @InjectRepository(ResourceType)
    private resourceTypeRepository: Repository<ResourceType>
  ) { }

  /**
   * @description
   * @param resourceTypeInput 
   * @returns 
   */
  async findOneOrCreate(resourceTypeInput: ResourceTypeInput): Promise<ResourceType> {
    try {
      const { name } = resourceTypeInput;
      if (!name) return null;
      const resourceType = await this.resourceTypeRepository.findOne({ where: { name } })
      if (!resourceType) {
        const resourceTypeInstance = this.resourceTypeRepository.create({ name });
        return await this.resourceTypeRepository.save(resourceTypeInstance);
      }
      return resourceType
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param resourceTypes 
   * @returns 
   */
  async findAllByNameOrCreate(resourceTypes: ResourceTypeInput[]): Promise<ResourceType[]> {
    try {
      const newResourceType = []
      for (let resourceType of resourceTypes) {
        const newResourceTypeInput = new ResourceTypeInput()
        newResourceTypeInput.name = (resourceType.name ? resourceType.name : resourceType) as string
        const validResourceType = await this.findOneOrCreate(newResourceTypeInput)
        if (validResourceType) {
          newResourceType.push(validResourceType)
        }
      }
      return newResourceType
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
  async findAllByIds(ids: string[] | null): Promise<ResourceType[]> {
    try {
      if(!ids){
        return [];
      }
      return await this.resourceTypeRepository.find({ where: { id: In(ids) } }) || [];
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
      const resourceTypes = await this.resourceTypeRepository.find({
        select: ['name'],
      });
      return (resourceTypes.map(resourceType => resourceType.name)) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}