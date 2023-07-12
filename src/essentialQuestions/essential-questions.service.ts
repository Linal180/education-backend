import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EssentialQuestion } from "./entities/essential-questions.entity";
import { EssentialQuestionTitleInput ,EssentialQuestionInput } from "./dto/essential-question.input.dto"
import { ILike, Repository } from "typeorm";

@Injectable()
export class EssentialQuestionsService {
  constructor(
    @InjectRepository(EssentialQuestion)
    private readonly essentialQuestionRepository: Repository<EssentialQuestion>
  ) { }

  /**
   * @description
   * @param essentialQuestionInput 
   * @returns 
   */
  async findOneOrCreate(essentialQuestionInput: EssentialQuestionInput): Promise<EssentialQuestion> {
    try {
      const { name } = essentialQuestionInput;
      const essentialQuestion = await this.essentialQuestionRepository.findOne({
        where: {
          name: name,
        },
      });
      if (!essentialQuestion) {
        const essentialQuestionInstance = this.essentialQuestionRepository.create({ name });
        return await this.essentialQuestionRepository.save(essentialQuestionInstance) || null;
      }
      return essentialQuestion
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  /**
   * @description
   * @param essentialQuestionInput 
   * @returns 
   */
  async findOneByTitleOrCreate(essentialQuestionInput: EssentialQuestionTitleInput): Promise<EssentialQuestion> {
    try {
      const { Title } = essentialQuestionInput;
      const essentialQuestion = await this.essentialQuestionRepository.findOne({
        where: {
          name: Title,
        },
      });
      if (!essentialQuestion) {
        const essentialQuestionInstance = this.essentialQuestionRepository.create({ name: Title });
        return await this.essentialQuestionRepository.save(essentialQuestionInstance) || null;
      }
      return essentialQuestion
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description 
   * @param essentialQuestions 
   * @returns 
   */
  async findByNameOrCreate(essentialQuestions: EssentialQuestionTitleInput[]): Promise<EssentialQuestion[]> {
    try {
      const newEssentialQuestions = []
      for (let essentialQuestion of essentialQuestions) {
        const validEssentialQuestions = await this.findOneByTitleOrCreate(essentialQuestion)
        if (validEssentialQuestions) {
          newEssentialQuestions.push(validEssentialQuestions)
        }
      }
      return newEssentialQuestions
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @returns 
   */
  async findAllDistinctByName(): Promise<string[]> {
    try {
      const formats = await this.essentialQuestionRepository.find({
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