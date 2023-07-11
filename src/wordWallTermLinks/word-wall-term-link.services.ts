import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WordWallTermLink } from "./entities/word-wall-term-link.entity";
import { wordWallLinkInput , wordWallTermLinkInput } from "./dto/word-wall-term-link.input.dto"
import { Repository } from "typeorm";
@Injectable()
export class WordWallTermLinksService {
  constructor(
    @InjectRepository(WordWallTermLink)
    private wordWallTermLinksRepository: Repository<WordWallTermLink>
  ) { }

  /**
   * @description
   * @param mediaOutletMentiondInput 
   * @returns 
   */
  async findOneOrCreate(wordWallLinkInput: wordWallLinkInput): Promise<WordWallTermLink> {
    try {
      const { name } = wordWallLinkInput;
      const wordWallTermLink = await this.wordWallTermLinksRepository.findOne({ where: { name } });
      if (!wordWallTermLink) {
        const wordWallTermLinkInstance = this.wordWallTermLinksRepository.create({ name });
        return await this.wordWallTermLinksRepository.save(wordWallTermLinkInstance) || null;
      }
      return wordWallTermLink
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByTermOrCreate(wordWallTermLinkInput : wordWallTermLinkInput ): Promise<WordWallTermLink> {
    try {
      const { Term } = wordWallTermLinkInput;
      const wordWallTermLink = await this.wordWallTermLinksRepository.findOne({ where: { name:Term } });
      if (!wordWallTermLink) {
        const wordWallTermLinkInstance = this.wordWallTermLinksRepository.create({ name:Term });
        return await this.wordWallTermLinksRepository.save(wordWallTermLinkInstance) || null;
      }
      return wordWallTermLink
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
  async findByNameOrCreate(wordWallTermLinks: wordWallTermLinkInput[]): Promise<WordWallTermLink[]> {
    try {
      const newWordWallTermLinks = []
      for (let wordWallTermLink of wordWallTermLinks) {
        const validWordWallTermLink = await this.findOneByTermOrCreate(wordWallTermLink)
        if (validWordWallTermLink) {
          newWordWallTermLinks.push(validWordWallTermLink)
        }
      }
      return newWordWallTermLinks
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
      const wordWallTermLinks = await this.wordWallTermLinksRepository.find({
        select: ['name'],
      });
      const distinctWordWallTermLinks = Array.from(new Set(wordWallTermLinks.map(format => format.name)));
      return distinctWordWallTermLinks
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}