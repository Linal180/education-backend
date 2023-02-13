import { HttpStatus, NotFoundException, UseFilters } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { HttpExceptionFilter } from 'src/exception-filter';
import { CreateResourceInput } from '../dto/resource-input.dto';
import ResourceInput, { ResourceFakePayload, ResourcePayload, ResourcesFakePayload } from '../dto/resource-payload.dto';
import { GetResource, RemoveResource, UpdateResourceInput } from '../dto/update-resource.input';
import { Journalist } from '../entities/journalist.entity';
import { Resource } from '../entities/resource.entity';
import { ResourcesService } from '../services/resources.service';

@Resolver('resources')
@UseFilters(HttpExceptionFilter)
export class ResourcesResolver {
  constructor(private readonly resourcesService: ResourcesService) { }

  @Mutation((returns) => ResourcePayload)
  async createResource(@Args('createResourceInput') createResourceInput: CreateResourceInput): Promise<ResourcePayload> {
    return {
      resource: await this.resourcesService.create(createResourceInput),
      response: { status: 200, message: 'Resource created successfully' },
    };
  }

  @Mutation((returns) => ResourcePayload)
  async updateResource(@Args('updateResourceInput') updateResourceInput: UpdateResourceInput): Promise<ResourcePayload> {
    return {
      resource: await this.resourcesService.update(updateResourceInput),
      response: { status: 200, message: 'Resource updated successfully' },
    };
  }

  @Query(returns => ResourceFakePayload)
  async getResource(@Args('getResource') getResource: GetResource) {
    return {  
      resource: await this.resourcesService.findOne(getResource.id),
      response: { status: 200, message: 'Resource fetched successfully' }
    };
  }

  @Query(returns => ResourcesFakePayload)
  async getResources(@Args('resourceInput') resourceInput: ResourceInput): Promise<ResourcesFakePayload> {
    const {limit, page } = resourceInput.paginationOptions
    const resources =  await this.resourcesService.find(page, limit);
    if (resources) {
      return {
        resources: resources,
        response: {
          message: "OK", status: 200,
        }
      }
    }
    throw new NotFoundException({
      status: HttpStatus.NOT_FOUND,
      error: 'Contacts not found',
    });
  }


  // @ResolveField(() => [Journalist])
  // async journalist(@Parent() resource: Resource): Promise<Journalist> {
  //   console.log("..resource",resource);
  //   if (resource && resource.journalist) {
  //     return await this.resourcesService.getJournalist(resource.journalistId);
  //   }
  // }

  @Mutation(() => ResourcePayload)
  async removeResource(@Args('id') { id }: RemoveResource) {
    await this.resourcesService.removeResource(id);
    return { response: { status: 200, message: 'Resource Deleted' } };
  }
}
