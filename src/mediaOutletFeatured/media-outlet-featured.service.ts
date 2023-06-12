import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MediaOutletFeaturedInput } from "./dto/media-outlet-featured.input.dto"
import { InjectRepository } from "@nestjs/typeorm";
import { MediaOutletsFeatured } from "./entities/media-outlet-featured.entity";
import { Repository } from "typeorm";

@Injectable()
export class MediaOutletsFeaturedService {
  constructor(
    @InjectRepository(MediaOutletsFeatured)
    private readonly mediaOutletsFeaturedRepository: Repository<MediaOutletsFeatured>
  ) {}
  
  async findOneOrCreate(mediaOutletFeaturedInput: MediaOutletFeaturedInput): Promise<MediaOutletsFeatured> {
    try {
      const { name } = mediaOutletFeaturedInput;
      const mediaOutletFeatured = await this.mediaOutletsFeaturedRepository.findOne({ where: { name } });
      if (!mediaOutletFeatured) {
        const mediaOutletFeaturedInstance = this.mediaOutletsFeaturedRepository.create({ name });
        return await this.mediaOutletsFeaturedRepository.save(mediaOutletFeaturedInstance) || null;
      }
      return mediaOutletFeatured
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByNameOrCreate(mediaOutletsFeatured: MediaOutletFeaturedInput[]): Promise<MediaOutletsFeatured[]> {
    try {
      const newMediaOutletsFeatured = []
      for (let mediaOutlet of mediaOutletsFeatured) {
        const validMediaOutletFeatured = await this.findOneOrCreate(mediaOutlet)
        if (validMediaOutletFeatured) {
          newMediaOutletsFeatured.push(validMediaOutletFeatured)
        }
      }
      return newMediaOutletsFeatured
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllDistinctByName(): Promise<string[]> {
    try {
      const formats = await this.mediaOutletsFeaturedRepository.find({
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