import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClassRoomNeed } from "./entities/classroom-needs.entity";
import { FindManyOptions, FindOneOptions, In, Repository , UpdateResult} from "typeorm";
import { ClassRoomNeedInput } from "./dto/classroom-need.input.dto";
interface ClassRoomNeedFilter {
  [key: string]: string | number | boolean | Date | FindOneOptions<ClassRoomNeed>;
}
@Injectable()
export class ClassRoomNeedService {
  constructor(
    @InjectRepository(ClassRoomNeed)
    private classRoomNeedRepository: Repository<ClassRoomNeed>,
  ) { 
    
  }

  /**
   * @description find a classRoomNeed by its name or create a new one if it doesn't exist in the repository
   * @param classRoomNeedInput 
   * @returns 
   */
  async findOneOrCreateClassRoomNeed(classRoomNeedInput: ClassRoomNeedInput): Promise<ClassRoomNeed | null> {
    try {
      const { name } = classRoomNeedInput;
      const classRoomNeed = await this.findOne({ where: { name } });
      if (!classRoomNeed) {
        return await this.create({ name });
      }
      return classRoomNeed
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description find the classRoomNeeds by name 
   * @param classRoomNeeds 
   * @returns 
   */
  async findAllByNameOrCreate(classRoomNeeds: ClassRoomNeedInput[]): Promise<ClassRoomNeed[]> {
    try {
      const newClassRoomNeeds = []
      for (let classRoomNeed of classRoomNeeds) {
        const newClassRoomNeed = new ClassRoomNeedInput()
        newClassRoomNeed.name = (classRoomNeed.name ? classRoomNeed.name : classRoomNeed) as string
        const validClassRoomNeed = await this.findOneOrCreateClassRoomNeed(newClassRoomNeed)
        if (validClassRoomNeed) {
          newClassRoomNeeds.push(validClassRoomNeed)
        }
      }
      return newClassRoomNeeds
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description Find classRoomNeeds on the base of the classRoomNeed ids array
   * @param ids 
   * @returns  the classRoomNeeds array if found or empty array if not found
   */
  async findAllByIds(ids: string[]): Promise<ClassRoomNeed[]> {
    try {
      return await this.findMany({ where: { id: In(ids) } }) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description Get all classRoomNeeds and return a list of classRoomNeeds names
   * @returns 
   */
  async findAllByName(): Promise<string[]> {
    try {
      const classRoomNeeds = await this.findMany({
        select: ['name'],
      });
      return classRoomNeeds.map(classRoomNeed => classRoomNeed.name) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description create a new classRoomNeed on the base of the classRoomNeed name if  it exist it will be added to the classRoomNeed
   * @param classRoomNeed 
   * @returns 
   */
  async create(classRoomNeed: Partial<ClassRoomNeed>): Promise<ClassRoomNeed | null> {
    try {
      const { name, ...rest } = classRoomNeed;
      if (!name) {
        return null
      }
      const newClassRoomNeed = this.classRoomNeedRepository.create({ name, ...rest });
      const savedClassRoomNeed = await this.classRoomNeedRepository.save(newClassRoomNeed);
      return savedClassRoomNeed || null;
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  /**
   * 
   * @returns all the classRoomNeeds entities that are currently available
   */
  async findAll(): Promise<ClassRoomNeed[]> {
    return await this.classRoomNeedRepository.find();
  }

  /**
   * @description  find the first classRoomNeed on the base of the condition.
   * @param id 
   * @returns 
   */
  async findById(id: string): Promise<ClassRoomNeed | null> {
    return await this.findOne({ where: { id } }) as ClassRoomNeed || null;
  }

  /**
   * @description updates the classRoomNeed property base on the filter
   * @param filter 
   * @param updateData 
   * @returns return updated classRoomNeed or null if not found
   */
  async update(filter: ClassRoomNeedFilter, updateData: Partial<ClassRoomNeed>): Promise<ClassRoomNeed | null> {
    try {
      const { affected }: UpdateResult = await this.classRoomNeedRepository.update(filter, updateData);
  
      if (affected === 0) {
        return null; // If no rows were affected, return null or throw an error
      }
  
      const updatedClassRoomNeed: ClassRoomNeed | undefined = await this.classRoomNeedRepository.findOne(filter);
  
      return updatedClassRoomNeed || null;
    } catch (error) {
      // Handle the error based on your requirements
      console.error('Failed to update class room need:', error);
      return null; // or throw a custom error
    }
  }
  
  /**
   * @description find the first classRoomNeed based o nthe condition.
   * @param filter 
   * @returns 
   */
  async findOne(filter: FindOneOptions<ClassRoomNeed>): Promise<ClassRoomNeed | null> {
    try {
      const classRoomNeed = await this.classRoomNeedRepository.findOne(filter) as ClassRoomNeed;
      return classRoomNeed || null;
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description find a classRoomNedd on the base of filters
   * @param filter 
   * @returns the classRoomNedd arrray or empty array if no classRoomNedd is found
   */
  async findMany(filter: FindManyOptions<ClassRoomNeed>): Promise<ClassRoomNeed[]> {
    try {
      return await this.classRoomNeedRepository.find(filter) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}