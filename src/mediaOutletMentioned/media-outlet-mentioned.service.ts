import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MediaOutletsMentioned } from "./entities/media-outlet-mentioned.entity";
import { Repository } from "typeorm";
import { MediaOutletMentiondInput } from "./dto/media-outlet-mentioned.input.dto"

@Injectable()
export class MediaOutletsMentionedService {
  constructor(
    @InjectRepository(MediaOutletsMentioned)
    private readonly mediaOutletsMentionedRepository: Repository<MediaOutletsMentioned>
  ) { }

  /**
   * @description
   * @param mediaOutletMentiondInput 
   * @returns 
   */
  async findOneOrCreate(mediaOutletMentiondInput: MediaOutletMentiondInput): Promise<MediaOutletsMentioned> {
    try {
      const { name } = mediaOutletMentiondInput;
      const mediaOutletsMentioned = await this.mediaOutletsMentionedRepository.findOne({ where: { name } });
      if (!mediaOutletsMentioned) {
        const mediaOutletMentionedInstance = this.mediaOutletsMentionedRepository.create({ name });
        return await this.mediaOutletsMentionedRepository.save(mediaOutletMentionedInstance) || null;
      }
      return mediaOutletsMentioned
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param mediaOutletsMentiond 
   * @returns 
   */
  async findByNameOrCreate(mediaOutletsMentiond: MediaOutletMentiondInput[]): Promise<MediaOutletsMentioned[]> {
    try {
      const newMediaOutletsMentiond = []
      for (let mediaOutlet of mediaOutletsMentiond) {
        const validMediaOutletMentiond = await this.findOneOrCreate(mediaOutlet)
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

  /**
   * @description
   * @returns 
   */
  async findAllDistinctByName(): Promise<string[]> {
    try {
      const formats = await this.mediaOutletsMentionedRepository.find({
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