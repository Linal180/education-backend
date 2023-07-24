import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserPayload } from './dto/register-user-payload.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Delete(':awsSub')
  async deleteOnAwsAub(
    @Param('awsSub') awsSub: string,
  ): Promise<UserPayload> {
    return {
      user: await this.usersService.deleteOnAwsSub(awsSub),
      response: { status: 200, message: "User Delete Successfully" }
    }
  }

  @Get('/test')
  async forgotPassword(): Promise<UserPayload> {
    return {
      user: await this.usersService.forgotPassword("khalid.rasool@kwanso.com"),
      response: { status: 200, message: "User Delete Successfully" }
    }
  }

}