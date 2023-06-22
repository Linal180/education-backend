import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Organization, schoolType } from "./entities/organization.entity";
import { HttpService } from "@nestjs/axios";
import { OrganizationInput, OrganizationSearchInput } from "./dto/organization-input.dto";
import { OrganizationsPayload } from "./dto/organization-payload";
import { queryParamasString } from "src/lib/helper";
import { Connection, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private connection: Connection,
    private readonly httpService: HttpService
  ) { }

  /**
   * @description  Get Organizations Details
   * @param organizationSearchInput 
   * @returns 
   */
  async getOrganizations(organizationSearchInput: OrganizationSearchInput): Promise<OrganizationsPayload> {
    try {
      const { searchSchool, category, paginationOptions } = organizationSearchInput;
      const { page, limit } = paginationOptions ?? {};

      if (!category) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: `Category not found`,
        });
      }

      const searchOptions = {};
      const commonKeys = {
        outFields: `NAME,ZIP,CITY,STATE,STREET`,
        f: "json",
        returnGeometry: false,
        resultOffset: page ? String((page - 1) * limit) : "0", // (page -1 )* 10 how much document you want to miss document
        resultRecordCount: limit ? String(limit) : "10",
      };

      if (searchSchool) {
        const words = searchSchool.match(/[a-zA-Z]+|\d+/g);
        const text = words.filter((word) => isNaN(parseInt(word)));
        const numbers = words
          .filter((word) => !isNaN(parseInt(word)))
          .map(Number);
        let zip = numbers[0];
        let name = text.join(" ");

        if (name) {
          searchOptions["name"] = `${'NAME'} LIKE '${name}%'`;
          searchOptions["city"] = `${'CITY'} LIKE '${name}%'`;
        }
        if (zip) {
          searchOptions["zip"] = `${'ZIP'} LIKE '${zip}%'`;
        }

      }

      // search query
      let likeQuery = Object.entries(searchOptions)
        .map(([key, value]) => value)
        .join(" OR ");

      //convert query Object to URL
      const queryParams = queryParamasString(commonKeys);
      let schoolsData;
      if (category) {
        let url = `https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/${category}/FeatureServer/${'0'}/query?where=${likeQuery ? likeQuery : "1=1"
          }&${queryParams}`;
        schoolsData = await this.httpService.axiosRef.get(url);
      }

      const { data } = schoolsData ?? {};

      //remove extra key from features
      let OrganizationPayload = [];
      if (data) {
        OrganizationPayload = data.features?.map((school) => {
          let filterSchool = { ...school.attributes, category };
          return Object.entries(filterSchool).reduce((acc, [key, value]) => {
            acc[key.toLowerCase()] = value;
            return acc;
          }, {});
        });

      }

      return {
        pagination: {
          page: page ? page : 1,
          limit: limit ? limit : 10,
        },
        organizations: OrganizationPayload ? OrganizationPayload : [],
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param organizationUserInput 
   * @returns 
   */
  async findOneOrCreate(organizationUserInput: OrganizationInput): Promise<Organization> {
    try {
      const { name, zip, city, category, state, street } = organizationUserInput
      let organization = await this.organizationRepository.findOne({
        where: {
          name: name,
          category: category
        }
      })
      if (organization) {
        return organization
      }

      const organizationInstance = this.organizationRepository.create({ name, zip, city, category, state, street })
      organization = await this.organizationRepository.save(organizationInstance)
      return organization
    }
    catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * @description
   * @param name 
   * @param category 
   * @returns 
   */
  async findOne(name: string, category: schoolType): Promise<Organization> {
    try {
      return await this.organizationRepository.findOne({
        where: {
          name,
          category
        }
      })
    }
    catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOrganizationById(id: string): Promise<Organization> {
    try {
      return this.organizationRepository.findOne({ where: { id }});
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}