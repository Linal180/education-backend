import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCourtInput } from "../dto/court-input.dto";
import { UpdateCourtInput } from "../dto/update-case.input";
import { Court } from "../entities/court.entity";
import { CourtToExternalUserToExternalUserRole } from "../entities/courtExternalUserToExternalUserRole.entity";

@Injectable()
export class CourtsService {
  constructor(
    @InjectRepository(Court)
    private courtsRepository: Repository<Court>,
    @InjectRepository(CourtToExternalUserToExternalUserRole)
    private courtToExternalUserToExternalUserRoleRepository: Repository<CourtToExternalUserToExternalUserRole>,
  ) { }


  /**
   * Creates courts service
   * @param createCourtInput 
   * @returns create 
   */
  async create(createCourtInput: CreateCourtInput): Promise<Court> {
    try {
      const courtInput = this.courtsRepository.create(createCourtInput)
      return await this.courtsRepository.save(courtInput);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
/**
 * Updates courts service
 * @param updateCourtInput 
 * @returns update 
 */
async update(updateCourtInput: UpdateCourtInput): Promise<Court> {
    const { id } = updateCourtInput
    try {
      await this.courtsRepository.update(id, { ...updateCourtInput });
      return  await this.courtsRepository.findOneBy({ id }) 
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

/**
 * Finds one
 * @param id 
 * @returns one 
 */
async findOne(id: string): Promise<Court> {
    return await this.courtsRepository.findOne({ where: { id } });
}

/**
 * Removes court
 * @param id 
 */
async removeCourt(id) {
    try {
      await this.courtsRepository.delete(id)
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}
