import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResourceType, ResourceTypeInput } from "./entities/resource-types.entity";
import { In, Repository } from "typeorm";


@Injectable()
export class ResourceTypeService {
    constructor(
        @InjectRepository(ResourceType)
        private readonly resourceTypeRepository: Repository<ResourceType>
    ) { }

    async findOneAndCreate(resourceTypeInput:ResourceTypeInput):Promise<ResourceType>{
        try{
            const { name  } = resourceTypeInput;
            const resourceType = this.resourceTypeRepository.findOne({ where: { name } });
            if(!resourceType){
                const PrerequisiteInstance = this.resourceTypeRepository.create({ name  });
                return await this.resourceTypeRepository.save(PrerequisiteInstance);
            }
            return resourceType
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByNameOrCreate(resourceTypes:ResourceTypeInput[]):Promise<ResourceType[]>{
        try{
            const newResourceType = []
            for(let resourceType of resourceTypes){ 
                const validResourceType = await this.findOneAndCreate(resourceType)
                if(validResourceType){
                    newResourceType.push(validResourceType)
                }
            }
            return newResourceType
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByIds<T>(ids: string[]): Promise<T[]>{
        try{
            const nlpStandards = await this.resourceTypeRepository.find({ where: { id: In(ids) } });
            return nlpStandards as T[]
        }
        catch(error){
          throw new InternalServerErrorException(error);
        }
    }

    async findAllDistinctByName(): Promise<string[]> {
        try{
            const resourceTypes = await this.resourceTypeRepository.find({
                select: ['name'],
            });
            const distinctResourceTypes = Array.from(new Set(resourceTypes.map(resourceType => resourceType.name)));
            return distinctResourceTypes
        }
        catch(error) {
            throw new InternalServerErrorException(error);
        }
    }
}