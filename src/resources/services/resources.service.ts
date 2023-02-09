import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, In, Repository } from "typeorm";
import { CreateResourceInput } from "../dto/resource-input.dto";
import { UpdateResourceInput } from "../dto/update-resource.input";
import { Journalist } from "../entities/journalist.entity";
import { Resource } from "../entities/resource.entity";

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    @InjectRepository(Journalist)
    private journalistRepository: Repository<Journalist>,
    private connection: Connection,
  ) {}


  /**
   * Creates resource service
   * @param createResourceInput 
   * @returns create 
   */
  async create(createResourceInput: CreateResourceInput): Promise<Resource> {
    const queryRunner = this.connection.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const newResource = this.resourcesRepository.create(createResourceInput);
      await manager.save(newResource);

      const journalists = await this.journalistRepository.find({
        where: { name: In(createResourceInput.journalists) },
      });

      for (const journalist of journalists) {
        newResource.journalist = [...newResource.journalist, journalist];
      }
      await manager.save(newResource);
      await queryRunner.commitTransaction();
      return newResource;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
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
