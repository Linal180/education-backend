import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WordWallTermLink } from "./entities/word-wall-term-link.entity";
import { wordWallTermLinkInput } from "./dto/word-wall-term-link.input.dto"
import { Repository } from "typeorm";



@Injectable()
export class WordWallTermLinksService{
  constructor(
    @InjectRepository(WordWallTermLink)
    private wordWallTermLinksRepository: Repository<WordWallTermLink>
  ){}
  async findOneOrCreate(mediaOutletMentiondInput: wordWallTermLinkInput): Promise<WordWallTermLink> {
    try {
      const { name } = mediaOutletMentiondInput;
      const mediaOutletsMentioned = await this.wordWallTermLinksRepository.findOne({ where: { name } });
      if (!mediaOutletsMentioned) {
        const mediaOutletMentionedInstance = this.wordWallTermLinksRepository.create({ name });
        return await this.wordWallTermLinksRepository.save(mediaOutletMentionedInstance) || null;
      }
      return mediaOutletsMentioned
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByNameOrCreate(wordWallTerms: wordWallTermLinkInput[]): Promise<WordWallTermLink[]> {
    try {
      const newWordWallTerms= []
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

  async findAllDistinctByName(): Promise<string[]> {
    try {
      const formats = await this.wordWallTermLinksRepository.find({
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