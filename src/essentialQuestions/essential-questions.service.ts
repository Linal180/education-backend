import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EssentialQuestion } from "./entities/essential-questions.entity";
import { EssentialQuestionInput } from "./dto/essential-question.input.dto"
import { ILike, Repository } from "typeorm";

@Injectable()
export class EssentialQuestionsService {
  constructor(
    @InjectRepository(EssentialQuestion)
    private readonly essentialQuestionRepository: Repository<EssentialQuestion>
  ) { }

  async findOneOrCreate(essentialQuestionInput: EssentialQuestionInput): Promise<EssentialQuestion> {
    try {
      const { name } = essentialQuestionInput;
      const mediaOutletsMentioned = await this.essentialQuestionRepository.findOne({
        where: {
          name: ILike(name),
        },
      });
      if (!mediaOutletsMentioned) {
        const mediaOutletMentionedInstance = this.essentialQuestionRepository.create({ name });
        return await this.essentialQuestionRepository.save(mediaOutletMentionedInstance) || null;
      }
      return mediaOutletsMentioned
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByNameOrCreate(essentialQuestions: EssentialQuestionInput[]): Promise<EssentialQuestion[]> {
    try {
      const newMediaOutletsMentiond = []
      for (let essentialQuestion of essentialQuestions) {
        const validMediaOutletMentiond = await this.findOneOrCreate(essentialQuestion)
        if (validMediaOutletMentiond) {
          newMediaOutletsMentiond.push(validMediaOutletMentiond)
        }
      }
      return newMediaOutletsMentiond
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

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