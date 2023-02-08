import { SetMetadata, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { HttpExceptionFilter } from 'src/exception-filter';
import { JwtAuthGraphQLGuard } from 'src/users/auth/jwt-auth-graphql.guard';
import RoleGuard from 'src/users/auth/role.guard';
import { CreateCourtInput } from '../dto/court-input.dto';
import { CourtPayload } from '../dto/court-payload.dto';
import { GetCourt, RemoveCourt, UpdateCourtInput } from '../dto/update-case.input';
import { CourtsService } from '../services/courts.service';

@Resolver('courts')
@UseFilters(HttpExceptionFilter)
export class CourtsResolver {
  constructor(private readonly courtsService: CourtsService) { }

  @Mutation((returns) => CourtPayload)
  @UseGuards(JwtAuthGraphQLGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'super-admin'])
  async createCourt(@Args('createCourtInput') createCourtInput: CreateCourtInput): Promise<CourtPayload> {
    return {
      court: await this.courtsService.create(createCourtInput),
      response: { status: 200, message: 'Court created successfully' },
    };
  }

  @Mutation((returns) => CourtPayload)
  @UseGuards(JwtAuthGraphQLGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'super-admin'])
  async updateCourt(@Args('updateCourtInput') updateCourtInput: UpdateCourtInput): Promise<CourtPayload> {
    return {
      court: await this.courtsService.update(updateCourtInput),
      response: { status: 200, message: 'Court updated successfully' },
    };
  }

  @Query(returns => CourtPayload)
  @UseGuards(JwtAuthGraphQLGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'super-admin'])
  async getCourt(@Args('getCourt') getCourt: GetCourt): Promise<CourtPayload> {
    return {
      court: await this.courtsService.findOne(getCourt.id),
      response: { status: 200, message: 'Court fetched successfully' }
    };
  }

  @Mutation(() => CourtPayload)
  @UseGuards(JwtAuthGraphQLGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'super-admin'])
  async removeCourt(@Args('id') { id }: RemoveCourt) {
    await this.courtsService.removeCourt(id);
    return { response: { status: 200, message: 'Court Deleted' } };
  }
}
