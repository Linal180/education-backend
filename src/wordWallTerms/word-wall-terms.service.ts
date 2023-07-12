import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WordWallTerms } from "./entities/word-wall-term.entity";
import { WordWallInput ,WordWallTermInput } from "./dto/word-wall-terms.input";
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
  async findOneOrCreate(wordWallInput: WordWallInput): Promise<WordWallTerms | null> {
    try {
      const { name } = wordWallInput;
      if(!name){
        return null
      }
      const wordWall = await this.wordWallTermsRepository.findOne({ where: { name } });
      if (!wordWall) {
        const wordWallInstance = this.wordWallTermsRepository.create({ name });
        return await this.wordWallTermsRepository.save(wordWallInstance) || null;
      }
      return wordWall
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findOneByTermOrCreate(wordWallTermInput :WordWallTermInput): Promise<WordWallTerms | null> {
    try {
      const { Term } = wordWallTermInput;
      if(!Term){
        return null;
      }
      const WordWallTerm = await this.wordWallTermsRepository.findOne({ where: { name: Term } });
      if (!WordWallTerm) {
        const WordWallTermInstance = this.wordWallTermsRepository.create({ name : Term });
        return await this.wordWallTermsRepository.save(WordWallTermInstance) || null;
      }
      return WordWallTerm
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
        const validWordWallTerm = await this.findOneByTermOrCreate(wordWall)
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
   * @param wordWallTerms 
   * @returns 
   */
    async findByTermOrCreate(wordWallTerms: WordWallTermInput[]): Promise<WordWallTerms[]> {
      try {
        const newWordWallTerms = []
        for (let wordWall of wordWallTerms) {
          const validWordWallTerm = await this.findOneByTermOrCreate(wordWall)
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