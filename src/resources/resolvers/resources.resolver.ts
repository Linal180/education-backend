import { HttpStatus, NotFoundException, UseFilters } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { HttpExceptionFilter } from '../../exception-filter';
import { ResourcesFilters } from '../dto/resource-filters-payload.dto';
import { CreateResourceInput } from '../dto/resource-input.dto';
import ResourceInput, { ResourcePayload, ResourcesPayload } from '../dto/resource-payload.dto';
import { GetResource, RemoveResource, UpdateResourceInput } from '../dto/update-resource.input';
import { AssessmentType } from '../../assessmentTypes/entities/assessment-type.entity';
import { ClassRoomNeed } from '../../classRoomNeeds/entities/classroom-needs.entity';
import { ContentLink } from '../../contentLinks/entities/content-link.entity';
import { Grade } from '../../grade/entities/grade-levels.entity';
import { Journalist } from '../../journalists/entities/journalist.entity';
import { Prerequisite } from '../../prerequisite/entities/prerequisite.entity';
import { ResourceType } from '../../resourceType/entities/resource-types.entity';
import { Resource } from '../entities/resource.entity';
import { SubjectArea } from '../../subjectArea/entities/subject-areas.entity';
import { ResourcesService } from '../services/resources.service';
import { NlpStandard } from 'src/nlpStandards/entities/nlp-standard.entity';

@Resolver(() => Resource)
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

  @Query(returns => ResourcePayload)
  async getResource(@Args('getResource') getResource: GetResource): Promise<ResourcePayload> {
    return {
      resource: await this.resourcesService.findOne(getResource.id),
      response: { status: 200, message: 'Resource fetched successfully' }
    };
  }

  @Query(returns => ResourcesPayload)
  async getResources(@Args('resourceInput') resourceInput: ResourceInput): Promise<ResourcesPayload> {
    const resources = await this.resourcesService.find(resourceInput);
    if (resources) {
      return {
        ...resources,
        response: {
          message: "OK", status: 200,
        }
      }
    }
    throw new NotFoundException({
      status: HttpStatus.NOT_FOUND,
      error: 'Resources not found',
    });
  }

  @Query(returns => ResourcesFilters)
  async getResourceFilters(): Promise<ResourcesFilters> {
    const filters = await this.resourcesService.findFilters();
    if (filters) {
      return {
        filters,
        response: {
          message: "OK", status: 200,
        }
      }
    }
    throw new NotFoundException({
      status: HttpStatus.NOT_FOUND,
      error: 'Resources not found',
    });
  }

  @ResolveField(() => [AssessmentType], { nullable: true })
  async assessmentType(@Parent() resource: Resource): Promise<AssessmentType[]> {
    if (resource && resource.id) {
      return await this.resourcesService.getAssessmentType(resource.id);
    }
  }

  @ResolveField(() => [ClassRoomNeed], { nullable: true })
  async classRoomNeed(@Parent() resource: Resource): Promise<ClassRoomNeed[]> {
    if (resource && resource.id) {
      return await this.resourcesService.getClassRoomNeed(resource.id);
    }
  }

  @ResolveField(() => [SubjectArea], { nullable: true })
  async subjectArea(@Parent() resource: Resource): Promise<SubjectArea[]> {
    if (resource && resource.id) {
      return await this.resourcesService.getSubjectArea(resource.id);
    }
  }

  @ResolveField(() => [Prerequisite], { nullable: true })
  async prerequisite(@Parent() resource: Resource): Promise<Prerequisite[]> {
    if (resource && resource.id) {
      return await this.resourcesService.getPrerequisite(resource.id);
    }
  }

  @ResolveField(() => [NlpStandard], { nullable: true })
  async nlpStandard(@Parent() resource: Resource): Promise<ResourceType[]> {
    if (resource && resource.id) {
      return await this.resourcesService.getNlpStandard(resource.id);
    }
  }

  @ResolveField(() => [ResourceType], { nullable: true })
  async resourceType(@Parent() resource: Resource): Promise<ResourceType[]> {
    if (resource && resource.id) {
      return await this.resourcesService.getResourceType(resource.id);
    }
  }

  @ResolveField(() => [Grade], { nullable: true })
  async gradeLevel(@Parent() resource: Resource): Promise<Grade[]> {
    if (resource && resource.id) {
      return await this.resourcesService.getGradeLevels(resource.id);
    }
  }

  @ResolveField(() => Journalist)
  async journalist(@Parent() resource: Resource): Promise<Journalist[]> {
    if (resource && resource.id) {
      return await this.resourcesService.getJournalists(resource.id);
    }
  }

  @ResolveField(() => [ContentLink], { nullable: true })
  async contentLink(@Parent() resource: Resource): Promise<ContentLink[]> {
    if (resource && resource.id) {
      return await this.resourcesService.getLinkToContent(resource.id);
    }
  }

  @Mutation(() => ResourcePayload)
  async removeResource(@Args('id') { id }: RemoveResource) {
    await this.resourcesService.removeResource(id);
    return { response: { status: 200, message: 'Resource Deleted' } };
  }
}
