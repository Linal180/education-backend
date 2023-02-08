import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Between, FindManyOptions, FindOperator, Repository, ObjectLiteral, FindOptionsWhere, WhereExpressionBuilder, ILike, In, Brackets } from "typeorm";
import { PaginatedEntityInput } from "./dto/pagination-entity-input.dto";
import PaginationPayloadInterface from "./dto/pagination-payload-interface.dto";

interface whereConditionInput {
  createdAt?: FindOperator<string>
  user?: {
    id: string
  },
}
interface WhereOptions<Entity = any> {
  where: whereConditionInput & (FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[] | ObjectLiteral | string),
  withDeleted?: boolean
}

interface FilterOptionsResponse {
  where?: ObjectLiteral
}

@Injectable()
export class PaginationService {

  /**
   * Will paginate
   * @template T 
   * @param repository 
   * @param paginationInput 
   * @returns paginated response PaginationPayloadInterface<T>
   */
  async willPaginate<T>(repository: Repository<T>, paginationInput: PaginatedEntityInput): Promise<PaginationPayloadInterface<T>> {
    try {
      const { associatedTo, relationField, associatedToField } = paginationInput;
      const { skip, take, order, where } = this.orchestrateOptions(paginationInput);
      let filterOption: FilterOptionsResponse = null;
      if (associatedTo && relationField && associatedToField?.columnValue) {
        filterOption = this.getFilterOptions(paginationInput);
      }
      const { paginationOptions: { page, limit } } = paginationInput || {};
      let query: FindManyOptions = null;

      if (filterOption) {
        query = {
          where: new Brackets((qb: WhereExpressionBuilder) => {
            qb.where(
              filterOption.where.str,
              filterOption.where.obj
            ).andWhere(where as ObjectLiteral)
          }),

          skip,
          take,
          order,
        }
      } else {
        query = {
          where: new Brackets((qb: WhereExpressionBuilder) => {
            qb.where(where as ObjectLiteral)
          }),
          skip,
          take,
          order,
        }
      }

      const paginatedQuery = repository.createQueryBuilder("data")

      if (relationField) {
        paginatedQuery.leftJoinAndSelect(`data.${relationField}`, associatedTo)
      }

      const [paginatedData, totalCount] = await paginatedQuery
        .where(query.where)
        .orderBy('data.createdAt', "DESC")
        .skip(query.skip)
        .take(query.take)
        .getManyAndCount()

      const totalPages = Math.ceil(totalCount / limit)

      if (page > totalPages)
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: 'Page Not Found',
        });

      return {
        totalCount,
        page,
        limit,
        totalPages,
        data: paginatedData,
      }

    } catch (error) {
      console.log("error", error)
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Filter options
   * @param paginationInput 
   * @returns options 
   */
  private getFilterOptions(paginationInput: PaginatedEntityInput): FilterOptionsResponse {
    const { associatedToField: { columnValue, columnName, columnName2, columnName3, filterType }, associatedTo } = paginationInput
    let where = { str: {}, obj: {} }
    if (filterType === 'enumFilter') {
      where = {
        str: `${associatedTo}.${columnName} IN (:...data)`,
        obj: { data: [...columnValue] }
      };
    } else if (filterType === 'stringFilter') {
      where = {
        str: `${associatedTo}.${columnName} ILIKE :data OR ${associatedTo}.${columnName2} ILIKE :data OR ${associatedTo}.${columnName3} ILIKE :data`,
        obj: { data: `%${columnValue}%` }
      };
    }
    return { where };
  }


  /**
   * Orchestrates options
   * @param paginationInput 
   * @returns options 
   */
  private orchestrateOptions(paginationInput: PaginatedEntityInput): FindManyOptions {
    const {
      status,
      to,
      from,
      searchField,
      paginationOptions: { page, limit: take } } = paginationInput || {}
    const skip = (page - 1) * take;
    const whereOptions: WhereOptions = {
      where: {
        ...(status != null && {
          status
        }),

        ...(searchField != null && searchField.term && {
          [searchField.columnValue]: ILike(`%${searchField.term}%`),
        }),
      }
    };

    // FROM - TO Filter
    if (from) {
      const toDate: Date = to ? new Date(to) : new Date()
      whereOptions.where.createdAt = Between(new Date(from).toISOString(), toDate.toISOString())
    }

    // Where clause options
    return {
      ...whereOptions,
      order: {
        createdAt: "DESC"
      },
      skip,
      take,
    };
  }
}