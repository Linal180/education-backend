import { Args, Query, Resolver } from "@nestjs/graphql";
import { OrganizationsPayload } from "./dto/organization-payload";
import { OrganizationSearchInput } from "./dto/organization-input.dto";
import { OrganizationsService } from "./organizations.service";

@Resolver('organizations')
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Query((returns) => OrganizationsPayload)
  async getOrganizations(@Args('filterOrganization') organizationsearchInput: OrganizationSearchInput): Promise<OrganizationsPayload> {
    try {
      const result = await this.organizationsService.getOrganizations(organizationsearchInput)
      return {
        organizations: result.organizations,
        pagination: result.pagination,
        response: { status: 200, message: 'Organizations Detail Retrieved' }
      }
    }
    catch (error) {
      console.log("error: ", error)
    }
  }

}