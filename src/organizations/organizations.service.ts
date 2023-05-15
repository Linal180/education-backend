import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Organization, schoolType } from "./entities/organization.entity";
import { HttpService } from "@nestjs/axios";
import { OrganizationInput  , OrganizationSearchInput } from "./dto/organization-input.dto";
import { OrganizationPayload, OrganizationsPayload } from "./dto/organization-payload";
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
    ){}

    /*
  * Get Organizations Details
   * @param organizationDetailInput
   * @returns organizations
   */
  async getOrganizations(
    organizationSearchInput: OrganizationSearchInput
  ): Promise<OrganizationsPayload> {
    try {
      const { searchSchool, category, paginationOptions } =
        organizationSearchInput;
      const { page, limit } = paginationOptions ?? {};

      if (!category) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: `Category not found`,
        });
      }



      const searchOptions = {};
      const commonKeys = {
        outFields: category != schoolType.CHARTER ? `NAME,ZIP,CITY` : `SCH_NAME,LZIP,LCITY`,
        f: "json",
        returnGeometry: false,
        resultOffset: page ? String((page -1 )* limit ) : "0", // (page -1 )* 10 how much document you want to miss document
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
          searchOptions["name"] = `${category != schoolType.CHARTER ? 'NAME' : 'SCH_NAME'} LIKE '${name}%'`;
          searchOptions["city"] = `${category != schoolType.CHARTER ? 'CITY' : 'LCITY'} LIKE '${name}%'`;
        }
        if (zip) {
          searchOptions["zip"] = `${category != schoolType.CHARTER ? 'ZIP' : 'LZIP'} LIKE '${zip}%'`;
        }

      }

      //
      let likeQuery = Object.entries(searchOptions)
        .map(([key, value]) => value)
        .join(" OR ");

      // console.log("likeQuery: ", likeQuery)

      if (category == schoolType.CHARTER) {
        likeQuery = `CHARTER_TEXT = 'Yes' ${likeQuery.length ? 'AND ( ' + likeQuery + ')' : ''} ` 
      }

      // console.log("likeQuery" , likeQuery)
      //convert query Object to URL
      const queryParams = queryParamasString(commonKeys);
      let schoolsData;
      if (category) {
        let url = `https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/${category}/FeatureServer/${category != schoolType.CHARTER ? '0' : '3'}/query?where=${likeQuery ? likeQuery : "1=1"
      }&${queryParams}`;
        schoolsData = await this.httpService.axiosRef.get(url);
      }

      const { data, status } = schoolsData ?? {};

      //remove extra key from featuresPayload
      let OrganizationPayload = [];
      if (data) {
        // console.log("data: ",data)
        OrganizationPayload = data.features?.map((school) => {
          let filterSchool = { ...school.attributes, category };

          if (category == schoolType.CHARTER) {
            filterSchool = {
              zip: filterSchool.LZIP,
              city: filterSchool.LCITY,
              name: filterSchool.SCH_NAME,
              category: filterSchool.category
            }
          }

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

  async create(organizationUserInput : OrganizationInput): Promise<Organization>{
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;
    try{
        const { name , zip , city , category} = organizationUserInput
        let organizationExist = await this.organizationRepository.findOne({
            where:{
                name : name,
                category : category
            }
        })
        // if(organizationExist){
        //     throw new ConflictException({
        //         status: HttpStatus.CONFLICT,
        //         error: "Organization already exists with that name and category",
        //       });
        // }

        const organizationInstance = manager.create(Organization, { name , zip , city , category})
        let organization = await manager.save(Organization, organizationInstance)
        await queryRunner.commitTransaction();
        return organization
    }
    catch(error){
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(error)
    }
    finally{
        await queryRunner.release();
    }

  }

  async findOne(name:string , category:schoolType):Promise<Organization>{
    try{
        return await this.organizationRepository.findOne({
            where:{
                name,
                category
            }
        })
    }
    catch(error){
        throw new InternalServerErrorException(error)
    }
  }
}