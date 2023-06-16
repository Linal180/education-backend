import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WordWallTerms } from "./entities/word-wall-term.entity";
import { WordWallTermInput } from "./dto/word-wall-terms.input";
import { Repository } from "typeorm";

@Injectable()
export class WordWallTermsService {
  constructor(
    @InjectRepository(WordWallTerms)
    private wordWallTermsRepository: Repository<WordWallTerms>
  ) { }

  /**
   * @description
   * @param mediaOutletMentiondInput 
   * @returns 
   */
  async findOneOrCreate(mediaOutletMentiondInput: WordWallTermInput): Promise<WordWallTerms> {
    try {
      const { name } = mediaOutletMentiondInput;
      const mediaOutletsMentioned = await this.wordWallTermsRepository.findOne({ where: { name } });
      if (!mediaOutletsMentioned) {
        const mediaOutletMentionedInstance = this.wordWallTermsRepository.create({ name });
        return await this.wordWallTermsRepository.save(mediaOutletMentionedInstance) || null;
      }
      return mediaOutletsMentioned
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param wordWallTerms 
   * @returns 
   */
  async findByNameOrCreate(wordWallTerms: WordWallTermInput[]): Promise<WordWallTerms[]> {
    try {
      const newWordWallTerms = []
      for (let wordWall of wordWallTerms) {
        const validWordWallTerm = await this.findOneOrCreate(wordWall)
        if (validWordWallTerm) {
          newWordWallTerms.push(validWordWallTerm)
        }
      }
      return newWordWallTerms
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
      const formats = await this.wordWallTermsRepository.find({
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