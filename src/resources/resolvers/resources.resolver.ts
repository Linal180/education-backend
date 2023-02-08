import { UseFilters } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HttpExceptionFilter } from 'src/exception-filter';
import { CreateResourceInput } from '../dto/resource-input.dto';
import { ResourcePayload } from '../dto/resource-payload.dto';
import { GetResource, RemoveResource, UpdateResourceInput } from '../dto/update-resource.input';
import { ResourcesService } from '../services/resources.service';

@Resolver('resources')
@UseFilters(HttpExceptionFilter)
export class ResourcesResolver {
  constructor(private readonly resourcesService: ResourcesService) { }

  // @Mutation((returns) => ResourcePayload)
  // async createResource(@Args('createResourceInput') createResourceInput: CreateResourceInput): Promise<ResourcePayload> {
  //   return {
  //     resource: await this.resourcesService.create(createResourceInput),
  //     response: { status: 200, message: 'Resource created successfully' },
  //   };
  // }

  @Mutation((returns) => ResourcePayload)
  async updateResource(@Args('updateResourceInput') updateResourceInput: UpdateResourceInput): Promise<ResourcePayload> {
    return {
      resource: await this.resourcesService.update(updateResourceInput),
      response: { status: 200, message: 'Resource updated successfully' },
    };
  }

  @Query(returns => ResourcePayload)
  async getResource(@Args('getResource') getResource: GetResource): Promise<ResourcePayload> {
    return {
      resource: await this.resourcesService.findOne(getResource.id),
      response: { status: 200, message: 'Resource fetched successfully' }
    };
  }

  @Mutation(() => ResourcePayload)
  async removeResource(@Args('id') { id }: RemoveResource) {
    await this.resourcesService.removeResource(id);
    return { response: { status: 200, message: 'Resource Deleted' } };
  }
}
