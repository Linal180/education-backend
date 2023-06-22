import { InjectRepository } from "@nestjs/typeorm";
import { Journalist } from "./entities/journalist.entity";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { In, Repository } from "typeorm";
import { JournalistInput } from "./dto/journalist.input.dto";


@Injectable()
export class JournalistsService {
  constructor(
    @InjectRepository(Journalist)
    private readonly journalistRepository: Repository<Journalist>
  ) { }

  /**
   * @description
   * @param journalistInput 
   * @returns 
   */
  async findOneOrCreate(journalistInput: JournalistInput): Promise<Journalist | null> {
    try {
      const { name, organization } = journalistInput;
      if (!name) {
        return null;
      }
      const journalist = await this.journalistRepository.findOne({ where: { name } });
      if (!journalist) {
        const journalistInstance = this.journalistRepository.create({ name, organization });
        return await this.journalistRepository.save(journalistInstance);
      }
      return journalist
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param journalists 
   * @returns 
   */
  async findByNameOrCreate(journalists: JournalistInput[]): Promise<Journalist[]> {
    try {
      const newJournalists = []
      for (let journalist of journalists) {
        const validJournalist = await this.findOneOrCreate(journalist)
        if (validJournalist) {
          newJournalists.push(validJournalist)
        }
      }
      return newJournalists
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
  async findAllByIds(ids: string[] | null): Promise<Journalist[]> {
    try {
      if(!ids){
        return [];
      }
      return await this.journalistRepository.find({ where: { id: In(ids) } }) || [];
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
      const journalists = await this.journalistRepository.find({
        select: ['name'],
      });
      return (journalists.map(journalist => journalist.name)) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}