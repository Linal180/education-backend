import { Field, InputType } from "@nestjs/graphql";
import { UserRole } from "../../users/entities/role.entity";
import { UserStatus } from "../../users/entities/user.entity";
import PaginationInput from "./pagination-input.dto";

@InputType()
export class PaginatedEntityInput {
  status?: UserStatus
  userId?: string
  to?: string
  from?: string
  surveyId?: string
  isCategory?: boolean
  dueToday?: boolean
  searchField?: { term: string, columnValue: string }
  associatedToField?: { id?: string, columnValue?: string[], columnValue2?: string, columnValue3?: string, columnName?: string, columnName2?: string, columnName3?: string, filterType: string }
  paginationOptions: PaginationInput
  role?: UserRole
  relationField?: string
  associatedTo?: string
  dimensionId?: string
  submissionId?: string
  isArchive?: boolean
}
