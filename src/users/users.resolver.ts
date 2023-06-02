import {
  HttpStatus,
  NotFoundException,
  UseFilters,
  UseGuards,
  SetMetadata,
  ForbiddenException,
  UsePipes,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { LoginSsoUserInput, LoginUserInput } from './dto/login-user-input.dto';
import { CurrentUser } from '../customDecorators/current-user.decorator';
import { UsersPayload, currentUserPayload } from './dto/users-payload.dto';
import { AccessUserPayload } from './dto/access-user.dto';
import { RegisterSsoUserInput, RegisterUserInput } from './dto/register-user-input.dto';
import { UserPayload } from './dto/register-user-payload.dto';
import { ForgotPasswordInput } from './dto/forget-password-input.dto';
import { ResetPasswordInput } from './dto/reset-password-input.dto';
import { ForgotPasswordPayload } from './dto/forgot-password-payload.dto';
import RolesPayload from './dto/roles-payload.dto';
import { UserIdInput } from './dto/user-id-input.dto';
import {
  ResendVerificationEmail,
  UpdateUserInput,
} from './dto/update-user-input.dto';
import UsersInput from './dto/users-input.dto';
import { UpdateRoleInput } from './dto/update-role-input.dto';
import { VerifyEmailInput } from './dto/verify-email-input.dto';
import { CurrentUserInterface } from './auth/dto/current-user.dto';
import { HttpExceptionFilter } from '../exception-filter';
import { JwtAuthGraphQLGuard } from './auth/jwt-auth-graphql.guard';
import RoleGuard from './auth/role.guard';
import { VerifyUserAndUpdatePasswordInput } from './dto/verify-user-and-set-password.dto';
import { SearchUserInput } from './dto/search-user.input';
import { UpdatePasswordInput } from './dto/update-password-input';
// import { OrganizationSearchInput, OrganizationUserInput } from './dto/organization-user-input.dto';
import { OrganizationPayload } from '../organizations/dto/organization-payload';
import { UserValidationPipe } from './CustomPipe/registerUserValidation.pipe';

@Resolver('users')
@UseFilters(HttpExceptionFilter)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  // Queries
  @Query((returns) => UsersPayload)
  @UseGuards(JwtAuthGraphQLGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'super-admin'])
  async fetchAllUsers(
    @Args('userInput') usersInput: UsersInput,
  ): Promise<UsersPayload> {
    const users = await this.usersService.findAll(usersInput);
    if (users) {
      return {
        ...users,
        response: { status: 200, message: 'OK' },
      };
    }
  }

  @Query((returns) => UserPayload)
  @UseGuards(JwtAuthGraphQLGuard)
  async fetchUser(
    @CurrentUser() user: CurrentUserInterface,
  ): Promise<UserPayload> {
    const userFound = await this.usersService.findOne(user.email);
    return { user: userFound, response: { status: 200, message: 'User Data' } };
  }

  @Query((returns) => currentUserPayload)
  @UseGuards(JwtAuthGraphQLGuard)
  async me(@CurrentUser() user: CurrentUserInterface): Promise<currentUserPayload> {
    const userFound = await this.usersService.findOne(user.email);
    if (userFound.emailVerified) {
      return {
        user: userFound,
        response: { status: 200, message: 'User Data' },
      };
    }

    throw new ForbiddenException({
      status: HttpStatus.FORBIDDEN,
      error: 'Email changed or not verified, please verify your email',
    });
  }

  @Query((returns) => RolesPayload)
  @UseGuards(JwtAuthGraphQLGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'super-admin'])
  async fetchAllRoles(): Promise<RolesPayload> {
    const roles = await this.usersService.findAllRoles();
    if (roles) {
      return {
        roles,
        response: {
          message: 'OK',
          status: 200,
        },
      };
    }
    throw new NotFoundException({
      status: HttpStatus.NOT_FOUND,
      error: 'User not found',
    });
  }

  @Query((returns) => UsersPayload)
  @UseGuards(JwtAuthGraphQLGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'super-admin'])
  async searchUser(
    @Args('searchUserInput') searchUserInput: SearchUserInput,
  ): Promise<UsersPayload> {
    const users = await this.usersService.search(searchUserInput);
    return {
      users,
      response: { status: 200, message: 'User Data fetched successfully' },
    };
  }

  // Mutations
  @Mutation((returns) => AccessUserPayload)
  async login(@Args('loginUser') loginUserInput: LoginUserInput): Promise<AccessUserPayload> {
    const { email, password } = loginUserInput;
    const user = await this.usersService.findOne(email.trim());
    if (user) {
      if (user.emailVerified) {
        const {access_token , roles} = await this.usersService.createToken(user, password);
        return {
          access_token,
          roles,
          response: {
            message: access_token && roles ? "Token created successfully": "Incorrect Email or Password" ,
            status:  access_token && roles ?  HttpStatus.OK : HttpStatus.NOT_FOUND,
            name:  access_token && roles ? "Token Created" : "Email or Password invalid",
          }
        }
      }

      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: 'Email changed or not verified, please verify your email',
      });
    }
    throw new NotFoundException({
      status: HttpStatus.NOT_FOUND,
      error: 'User not found',
    });
  }

  @Mutation((returns) => AccessUserPayload)
  async loginSso(
    @Args('loginUser') loginUserInput: LoginSsoUserInput,
  ): Promise<AccessUserPayload> {
    try {
      const { token } = loginUserInput;

      if (token) {
        return await this.usersService.validateCognitoToken(token);
      }
  
      throw new NotFoundException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Token not provided',
      }); 
    } catch (error) {
      throw new HttpException(error.message , HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Mutation((returns) => UserPayload)
  async registerUser(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
  ): Promise<UserPayload> {
    return {
      user: await this.usersService.create(registerUserInput),
      response: { status: 200, message: 'User created successfully' },
    };
  }

  @Mutation((returns) => UserPayload)
  // @UsePipes(new UserValidationPipe())
  async registerSsoUser(@Args('registerUser') registerUserInput: RegisterSsoUserInput): Promise<UserPayload> {
    return {
      user: await this.usersService.validateSsoAndCreate(registerUserInput),
      response: { status: 200, message: 'User created successfully' },
    };
  }
  
  @Mutation((returns) => UserPayload)
  @UseGuards(JwtAuthGraphQLGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'super-admin', 'respondent'])
  async deactivateUser(
    @Args('user') { userId }: UserIdInput,
  ): Promise<UserPayload> {
    const user = await this.usersService.deactivateUser(userId);
    return { user, response: { status: 200, message: 'User Deactivated' } };
  }

  @Mutation((returns) => UserPayload)
  @UseGuards(JwtAuthGraphQLGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'super-admin'])
  async activateUser(
    @Args('user') { userId }: UserIdInput,
  ): Promise<UserPayload> {
    const user = await this.usersService.activateUser(userId);
    return { user, response: { status: 200, message: 'User Activated' } };
  }

  @Mutation((returns) => UserPayload)
  @UseGuards(JwtAuthGraphQLGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'super-admin', 'respondent'])
  async updateUser(
    @Args('user') updateUserInput: UpdateUserInput,
  ): Promise<UserPayload> {
    const user = await this.usersService.update(updateUserInput);
    return {
      user,
      response: { status: 200, message: 'User Data updated successfully' },
    };
  }

  @Mutation((returns) => UserPayload)
  @UseGuards(JwtAuthGraphQLGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'super-admin'])
  async updateRole(
    @Args('user') updateRoleInput: UpdateRoleInput,
  ): Promise<UserPayload> {
    const user = await this.usersService.updateRole(updateRoleInput);
    return {
      user,
      response: { status: 200, message: 'User Data updated successfully' },
    };
  }

  @Mutation((returns) => UserPayload)
  async updatePassword(
    @Args('updatePasswordInput') updatePasswordInput: UpdatePasswordInput,
  ): Promise<UserPayload> {
    const user = await this.usersService.setNewPassword(updatePasswordInput);
    if (user) {
      return {
        user,
        response: {
          status: 200,
          message: 'Password updated successfully',
          name: 'updatePassword successfully',
        },
      };
    }
    throw new NotFoundException({
      status: HttpStatus.NOT_FOUND,
      error: 'User not found',
    });
  }

  @Mutation(() => UserPayload)
  @UseGuards(JwtAuthGraphQLGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'super-admin'])
  async removeUser(@Args('user') { userId }: UserIdInput) {
    return {
      user: await this.usersService.remove(userId),
      response: { status: HttpStatus.OK, message: "User deleted successfully" },
    }

  }
}
