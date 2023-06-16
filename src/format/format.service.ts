import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Format } from "./entities/format.entity";
import { Repository } from "typeorm";
import { FormatInput } from "./dto/format.input.dto";


@Injectable()
export class FormatService {
  constructor(
    @InjectRepository(Format)
    private readonly formatRepository: Repository<Format>
  ) { }
  /**
   * 
   * @param formatInput 
   * @returns 
   */
  async findOneOrCreate(formatInput: FormatInput): Promise<Format> {
    try {
      const { name } = formatInput;
      const format = await this.formatRepository.findOne({ where: { name } });
      if (!format) {
        const formatInstance = this.formatRepository.create({ name });
        return await this.formatRepository.save(formatInstance) || null;
      }
      return format
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 
   * @param formats 
   * @returns 
   */
  async findByNameOrCreate(formats: string[]): Promise<Format[]> {
    try {
      const newFormats = []
      for (let format of formats) {
        const formatInput = new FormatInput()
        formatInput.name = format
        const validFormat = await this.findOneOrCreate(formatInput)
        if (validFormat) {
          newFormats.push(validFormat)
        }
      }
      return newFormats
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 
   * @returns 
   */
  async findAllDistinctByName(): Promise<string[]> {
    try {
      const formats = await this.formatRepository.find({
        select: ['name'],
      });
      const distinctFormats = Array.from(new Set(formats.map(format => format.name)));
      return distinctFormats
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}