import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NLNOTopNavigation } from "./entities/nlno-top-navigation.entity";
import { Repository } from "typeorm";
import { NLNOTopNavigationInput } from "./dto/nlno-top-navigation.input.dto";

@Injectable()
export class NLNOTopNavigationService {
  constructor(
    @InjectRepository(NLNOTopNavigation)
    private readonly NLNOTopNavigationRepository: Repository<NLNOTopNavigation>
  ) { }

  /**
   * @description
   * @param nlnoTopNavigationInput 
   * @returns 
   */
  async findOneOrCreate(nlnoTopNavigationInput: NLNOTopNavigationInput): Promise<NLNOTopNavigation | null> {
    try {
      const { name } = nlnoTopNavigationInput;
      if (!name) return null;
      const NLNOTopNavigation = await this.NLNOTopNavigationRepository.findOne({ where: { name } });
      if (!NLNOTopNavigation) {
        const NLNOTopNavigationInstance = this.NLNOTopNavigationRepository.create({ name });
        return (await this.NLNOTopNavigationRepository.save(NLNOTopNavigationInstance)) || null;
      }
      return NLNOTopNavigation
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param nlnoTopNavigations 
   * @returns 
   */
  async findAllByNameOrCreate(nlnoTopNavigations: NLNOTopNavigationInput[]): Promise<NLNOTopNavigation[]> {
    try {
      const newNlnoTopNavigations = []
      for (let nlnoTopNavigation of nlnoTopNavigations) {
        const newNLNOTopNavigationInput = new NLNOTopNavigationInput()
        newNLNOTopNavigationInput.name = (nlnoTopNavigation.name ? nlnoTopNavigation.name : nlnoTopNavigation) as string
        const newNLNOTopNavigation = await this.findOneOrCreate(newNLNOTopNavigationInput)
        if (newNLNOTopNavigation) {
          newNlnoTopNavigations.push(newNLNOTopNavigation)
        }
      }
      return newNlnoTopNavigations
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
      const nlnoTopNavigations = await this.NLNOTopNavigationRepository.find({
        select: ['name'],
      });
      return (nlnoTopNavigations.map(nlnoTopNavigation => nlnoTopNavigation.name)) || [];
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  
}