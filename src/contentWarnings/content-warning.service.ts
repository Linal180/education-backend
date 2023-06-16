import { InjectRepository } from "@nestjs/typeorm";
import { ContentWarning } from "./entities/content-warning.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { InternalServerErrorException } from "@nestjs/common";
import { ContentWarningInput } from "./dto/content-warning.input.dto";

export class ContentWarningService {
  constructor(
    @InjectRepository(ContentWarning)
    private readonly contentWarningRepository: Repository<ContentWarning>
  ) { }

  /**
   * @description
   * @param contentWarningInput 
   * @returns 
   */
  async findOneOrCreate(contentWarningInput: ContentWarningInput): Promise<ContentWarning | null> {
    try {
      const { name } = contentWarningInput;
      if (!name) {
        return null;
      }
      const contentWarning = await this.findOne({ where: { name } });
      if (!contentWarning) {
        return await this.create({ name });
      }
      return contentWarning
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param contentWarnings 
   * @returns 
   */
  async findAllByNameOrCreate(contentWarnings: ContentWarningInput[]): Promise<ContentWarning[]> {
    try {
      const newContentWarnings = []
      for (let contentWarning of contentWarnings) {
        const newContentWarningInput = new ContentWarningInput()
        newContentWarningInput.name = (contentWarning.name ? contentWarning.name : contentWarning) as string
        const validContentWarning = await this.findOneOrCreate(newContentWarningInput)
        if (validContentWarning) {
          newContentWarnings.push(validContentWarning)
        }
      }
      return newContentWarnings
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
      const contentWarnings = await this.contentWarningRepository.find({
        select: ['name'],
      });
      return contentWarnings.map(contentWarning => contentWarning.name);
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  /**
   * @description
   * @param filter 
   * @returns 
   */
  async findOne(filter: FindOneOptions<ContentWarning>): Promise<ContentWarning | null> {
    try {
      return await this.contentWarningRepository.findOne(filter) as ContentWarning || null;
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  /**
   * @description
   * @param filter 
   * @returns 
   */
  async findMany(filter: FindManyOptions<ContentWarning>): Promise<ContentWarning[]> {
    try {
      return await this.contentWarningRepository.find(filter) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param contentWarning 
   * @returns 
   */
  async create(contentWarning: Partial<ContentWarning>): Promise<ContentWarning | null> {
    try {
      const { name, ...rest } = contentWarning;
      if (!name) {
        return null
      }
      const newContentWarningInstance = this.contentWarningRepository.create({ name, ...rest });
      const savedContentWarningInstance = await this.contentWarningRepository.save(newContentWarningInstance);
      return savedContentWarningInstance || null;
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}