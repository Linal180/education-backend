import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AccessUserPayload } from './dto/access-user.dto';
import { UserPayload } from './dto/register-user-payload.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('login')
  async login(@Body('token') token: string): Promise<AccessUserPayload> {
    return await this.usersService.validateCognitoToken(token);
  }

  @Delete(':awsSub')

  async deleteOnAwsAub(
    @Param('awsSub') awsSub: string,
  ): Promise<UserPayload> {
    return {
      user: await this.usersService.deleteOnAwsSub(awsSub),
      response: { status: 200, message: "User Delete Successfully" }
    }
  }

}