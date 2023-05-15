import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { OrganizationPayload, OrganizationsPayload } from "./dto/organization-payload";
import { OrganizationSearchInput, OrganizationInput, homeSchoolInput } from "./dto/organization-input.dto";
import { OrganizationsService } from "./organizations.service";
import { Any } from "typeorm";
import { InternalServerErrorException } from "@nestjs/common";
import { response } from "express";


@Resolver('organizations')
export class OrganizationsResolver {
    constructor(private readonly organizationsService : OrganizationsService  ){}

    @Query((returns) => OrganizationsPayload)
    async getOrganizations(
      @Args('filterOrganization') organizationsearchInput: OrganizationSearchInput
    ): Promise<OrganizationsPayload>{
      try{
        const result =  await this.organizationsService.getOrganizations(organizationsearchInput)
        return {
          organizations: result.organizations,
          pagination: result.pagination,
          response: { status: 200 , message: 'Organizations Detail Retrieved'}
        }
      }
      catch(error){
        console.log("error: ",error)
      }
    }

    @Mutation((returns) => OrganizationPayload )
    async createHomeSchool(
        @Args('homeSchool') organizationInput: homeSchoolInput
    ):Promise<OrganizationPayload>{
        try{
            return{
                organization: await this.organizationsService.create(organizationInput),
                response: { status: 200, message: 'Organization created successfully' },
            }
        }
        catch(error){
            console.log("error: ",error)
            throw new InternalServerErrorException(error);
        }
    }

}