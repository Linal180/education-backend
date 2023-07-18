import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NlpStandard } from "./entities/nlp-standard.entity";
import { FindManyOptions, FindOptionsSelect, In, Repository } from "typeorm";
import { NlpStandardInput, NlpStandardPayload } from "./dto/nlp-standard.input.dto";

@Injectable()
export class NlpStandardService {
  constructor(
    @InjectRepository(NlpStandard)
    private readonly nlpStandardRepository: Repository<NlpStandard>
  ) { }

  /**
   * @description
   * @param nlpStandardInput 
   * @returns 
   */
  async findOneOrCreate(nlpStandardInput: NlpStandardInput): Promise<NlpStandard> {
    try {
      const { name, description } = nlpStandardInput;
      if (!name) {
        return null;
      }
      const NlpStandard = await this.nlpStandardRepository.findOne({ where: { name } });
      if (!NlpStandard) {
        const NlpStandardInstance = this.nlpStandardRepository.create({ name, description });
        return await this.nlpStandardRepository.save(NlpStandardInstance);
      }
      return NlpStandard
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param nlpStandards 
   * @returns 
   */
  async findAllByNameOrCreate(nlpStandards: NlpStandardInput[]): Promise<NlpStandard[]> {
    try {
      const newNlpStandards = []
      for (let nlpStandard of nlpStandards) {
        const newNlpStandardInput = new NlpStandardInput()
        newNlpStandardInput.name = (nlpStandard.name ? nlpStandard.name : '') as string
        newNlpStandardInput.description = (nlpStandard.description ? nlpStandard.description : '') as string
        const validNlpStandard = await this.findOneOrCreate(newNlpStandardInput)
        if (validNlpStandard) {
          newNlpStandards.push(validNlpStandard)
        }
      }
      return newNlpStandards
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
  async findAllByIds(ids: string[] | null): Promise<NlpStandard[]> {
    try {
      if (!ids) {
        return [];
      }
      return await this.nlpStandardRepository.find({ where: { id: In(ids) } }) || [];
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
      const nlpStandards = await this.nlpStandardRepository.find({
        select: ['name'],
      });
      return (nlpStandards.map(nlpStandard => nlpStandard.name)) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getNlpStandardByFields(returnFields: string[]): Promise<NlpStandardPayload[]> {
    try {
      const select: FindOptionsSelect<NlpStandard> = returnFields.reduce(
        (acc, field) => {
          acc[field] = true;
          return acc;
        },
        {} as FindOptionsSelect<NlpStandard>,
      );
      const nlpStandards = await this.nlpStandardRepository.find({ select });
      return nlpStandards || [];
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }




}