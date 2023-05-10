import { ArgumentMetadata, BadRequestException, ConsoleLogger, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { RegisterUserInput } from "../dto/register-user-input.dto";
import { validate } from "class-validator";
import { UserRole } from "../entities/role.entity";

@Injectable()
export class UserValidationPipe implements PipeTransform<RegisterUserInput> {
    async transform(value: RegisterUserInput, metadata: ArgumentMetadata) {
        // console.log("here we are in this")
        // const errors = await  validate(value);
        // console.log("here we are in this----------------------------after eroro",errors)
        // if (errors.length > 0) {
        //     console.log("errors-----------------------------------------------: ",errors)
        //     throw new BadRequestException('Validation failed');
        // }

        // Validate based on the user role
    // if (value.roleType === UserRole.EDUCATOR || value.roleType === UserRole.STUDENT ) {
    //     if (!value.organization) {
    //       throw new BadRequestException('Organization is required for Student or Educator users');
    //     }
    //   } else if (value.roleType ===  UserRole.PUBLIC_USER) {
    //     console.log("here in this Public uSER code execute")
    //     if (value.organization) {
    //       throw new BadRequestException('Organization is not required for Public users');
    //     }
    //   }
    //   console.log("here we are in ok RegisterDto: ", RegisterUserInput)
       return RegisterUserInput;
    }
    
}