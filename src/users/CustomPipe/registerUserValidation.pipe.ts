import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { RegisterUserInput } from "../dto/register-user-input.dto";
import { validate } from "class-validator";
import { UserRole } from "../entities/role.entity";

@Injectable()
export class UserValidationPipe implements PipeTransform<RegisterUserInput> {
    async transform(value: RegisterUserInput, metadata: ArgumentMetadata) {
        const errors = await  validate(value);

        if (errors.length > 0) {
            throw new BadRequestException('Validation failed');
        }

        // Validate based on the user role
    if (value.roleType === 'admin') {
        if (!value.organization) {
          throw new BadRequestException('Department is required for admin users');
        }
      } else if (value.roleType ===  UserRole.PUBLIC_USER) {
        if (!value.organization) {
          throw new BadRequestException('Position is required for employee users');
        }
      }

        throw new Error("Method not implemented.");
    }
    
}