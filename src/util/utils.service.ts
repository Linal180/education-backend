import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DynamicClassEntity } from './dto/dynamic-entity';

@Injectable()
export class UtilsService {
  constructor() { }
  /**
    * Updates entity manager
    * @template T 
    * @param entity 
    * @param id 
    * @param attributes 
    * @param repository 
    * @returns entity manager 
    */
  async updateEntityManager<T>(entity: DynamicClassEntity<T>, id: string, attributes: QueryDeepPartialEntity<T>, repository: Repository<T>): Promise<T> {
    try {
      const update = await repository
        .createQueryBuilder()
        .update(entity)
        .set({ ...attributes })
        .where("id = :id", { id })
        .execute();

      if (update.affected > 0) {
        return await repository.createQueryBuilder()
          .where("id = :id", { id })
          .getOne()
      }

      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `${entity.name} Not found`,
      })
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async formatTsVector(text) {
    // Convert text to lowercase and replace any non-alphanumeric characters with spaces
    const cleanedText = text.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
    // Replace spaces with ' & ' to create a tsvector
    const tsVector = `to_tsvector('english', '${cleanedText.replace(/\s+/g, ' & ')}')`;
    return tsVector;
  }

  convertArrayOfObjectsToArrayOfString(arrayOfObjects: any[], keys: string[]): string[] {
    return arrayOfObjects.map(obj => keys.map(key => obj[key]).join(': '));
  }

}
