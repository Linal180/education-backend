import {
  HttpStatus,
  NotFoundException,
  UseFilters,
  UseGuards,
  SetMetadata,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { LoginUserInput } from './dto/login-user-input.dto';
import { CurrentUser } from '../customDecorators/current-user.decorator';
import { UsersPayload, currentUserPayload } from './dto/users-payload.dto';
import { AccessUserPayload } from './dto/access-user.dto';
import { OAuthProviderInput, RegisterUserInput, RegisterWithGoogleInput, RegisterWithMicrosoftInput, } from './dto/register-user-input.dto';
import { UserPayload } from './dto/register-user-payload.dto';
import { UserIdInput } from './dto/user-id-input.dto';
import UsersInput from './dto/users-input.dto';
import { CurrentUserInterface } from './auth/dto/current-user.dto';
import { HttpExceptionFilter } from '../exception-filter';
import { JwtAuthGraphQLGuard } from './auth/jwt-auth-graphql.guard';
import RoleGuard from './auth/role.guard';
import { SearchUserInput } from './dto/search-user.input';
import { UpdatePasswordInput } from './dto/update-password-input';
import { ResetPasswordInput } from './dto/reset-password-input.dto';
import { ForgotPasswordInput } from './dto/forget-password-input.dto';
import { ForgotPasswordPayload } from './dto/forgot-password-payload.dto';
import { ResponsePayload, ResponsePayloadResponse } from './dto/response-payload.dto';
import { CheckUserAlreadyExistsInput } from './dto/verify-email-input.dto';

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
    try {
      const { access_token, roles, email, isEducator, shared_domain_token, missingUser } = await this.usersService.createToken(loginUserInput);

      return {
        access_token,
        shared_domain_token,
        email,
        missingUser,
        roles,
        isEducator,
        response: {
          message: access_token && roles ? "Token created successfully" : "Incorrect Email or Password",
          status: access_token && roles ? HttpStatus.OK : HttpStatus.NOT_FOUND,
          name: access_token && roles ? "Token Created" : "Email or Password invalid",
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  @Query((returns) => AccessUserPayload)
  async checkUserCognito(@Args('email') email: string){
    const result = await this.usersService.checkUserExistOnCognito(email);

      return {
        roles:[],
        response: {
          message: result ? "User data is missing" : "User found ",
          status:result ? HttpStatus.OK : HttpStatus.NOT_FOUND,
          name: result ? "User don't exist " : "User found",
        }
      }
  }

  @Query((returns) => AccessUserPayload)
  async autoLogin(@Args('token') token: string): Promise<AccessUserPayload> {
    try {
      const { access_token, roles } = await this.usersService.performAutoLogin(token)

      return {
        access_token,
        // shared_domain_token,
        // email,
        roles,
        // isEducator,
        response: {
          message: access_token && roles ? "Token created successfully" : "Incorrect Email or Password",
          status: access_token && roles ? HttpStatus.OK : HttpStatus.NOT_FOUND,
          name: access_token && roles ? "Token Created" : "Email or Password invalid",
        }
      }
    }
    catch (error) {
      throw new Error(error)
    }
  }


  @Mutation(returns => ForgotPasswordPayload)
  async forgotPassword(@Args('forgotPassword') forgotPasswordInput: ForgotPasswordInput): Promise<ForgotPasswordPayload> {
    const { email } = forgotPasswordInput
    const user = await this.usersService.forgotPassword(email.trim().toLowerCase())

    if (user === true) {
      return { response: { status: 400, message: "Users who signed up with Google or microsoft, don't need to reset password" } }
    }

    if (user) {
      return { response: { status: 200, message: 'Forgot Password Email Sent to User' } }
    }

    throw new NotFoundException({
      status: HttpStatus.NOT_FOUND,
      error: 'User not found',
    });
  }

  @Mutation(returns => UserPayload)
  async resetPassword(@Args('resetPassword') resetPasswordInput: ResetPasswordInput): Promise<UserPayload> {
    const { token, password } = resetPasswordInput
    const user = await this.usersService.resetPassword(password, token)

    if (user) {
      return { user, response: { status: 200, message: "Password reset successfully", name: "PasswordReset successfully" } }
    }

    throw new NotFoundException({
      status: HttpStatus.NOT_FOUND,
      // error: 'Token not found',
      message: 'Token not found'
    });
  }

  @Mutation((returns) => UserPayload)
  async registerUser(
    @Args('registerUser') registerUserInput: RegisterUserInput,
  ): Promise<UserPayload> {
    try {
      const user = await this.usersService.create(registerUserInput);

      return {
        user,
        response: { status: 200, message: 'Registered successfully' },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Query((returns) => ResponsePayloadResponse)
  async verifyUserRegister(
    @Args('checkUserAlreadyExistsInput') checkUserAlreadyExistsInput: CheckUserAlreadyExistsInput):
    Promise<ResponsePayloadResponse> {
    try {
      const userNotExists = await this.usersService.checkEmailAlreadyRegistered(checkUserAlreadyExistsInput)

      const response: ResponsePayload = userNotExists
        ? { message: "Email available ", status: 200 }
        : { message: "User already exits", status: 500 }

      return { response }
    }
    catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
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

  @Mutation(() => UserPayload)
  async registerWithGoogle(@Args('registerWithGoogleInput') registerWithGoogleInput: RegisterWithGoogleInput): Promise<UserPayload> {
    try {
      const user = await this.usersService.registerWithGoogle(registerWithGoogleInput)
      if (user) {
        return {
          user,
          response: { status: 200, message: 'User register with the google' }
        }
      }
    }
    catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }


  }

  @Mutation(() => AccessUserPayload)
  async loginWithGoogle(@Args('loginWithGoogleInput') loginWithGoogleInput: OAuthProviderInput): Promise<AccessUserPayload> {
    try {
      const { access_token, shared_domain_token, roles, email, isSSO, isEducator, missingUser } = await this.usersService.loginWithGoogle(loginWithGoogleInput)
      return {
        access_token,
        isSSO,
        missingUser,
        shared_domain_token,
        email,
        isEducator,
        roles,
        response: {
          message: access_token && roles ? "Token created successfully" : "Incorrect Email or Password",
          status: access_token && roles ? HttpStatus.OK : HttpStatus.NOT_FOUND,
          name: access_token && roles ? "Token Created" : "Email or Password invalid",
        }
      }
    }
    catch (error) {
      throw new Error(error);
    };

  }


  @Mutation(() => UserPayload)
  async registerWithMicrosoft(@Args('registerWithMicrosoftInput') registerWithMicrosoftInput: RegisterWithMicrosoftInput) {
    try {
      const user = await this.usersService.registerWithMicrosoft(registerWithMicrosoftInput)
      if (user) {
        return {
          user,
          response: { status: 200, message: 'User register with the microsoft' }
        }
      }
    }
    catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Mutation(() => AccessUserPayload)
  async loginWithMicrosoft(@Args('loginWithMicrosoftInput') loginWithMicrosoftInput: OAuthProviderInput): Promise<AccessUserPayload> {
    try {
      const { access_token, shared_domain_token, roles, email, isSSO, isEducator, missingUser } = await this.usersService.loginWithMicrosoft(loginWithMicrosoftInput)
      return {
        access_token,
        shared_domain_token,
        email,
        missingUser,
        roles,
        isEducator,
        isSSO,
        response: {
          message: access_token && roles ? "Token created successfully" : "Incorrect Email or Password",
          status: access_token && roles ? HttpStatus.OK : HttpStatus.NOT_FOUND,
          name: access_token && roles ? "Token Created" : "Email or Password invalid",
        }
      }
    }
    catch (error) {
      throw new Error(error);
    }
  }





}
