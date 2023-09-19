import { Controller, Delete, HttpException, HttpStatus, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserEmailInput } from "src/util/interfaces";

@Controller('api')
export class CustomUserController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/users/update-email')
  async updateUserEmail(@Query('userName') userName: string, @Query('newEmail') newEmail?: string , @Query('newUsername') newUsername ?: string): Promise<any> {
    // Validate and process the request here
    if (!userName) {
      throw new HttpException('Missing userName parameter', HttpStatus.BAD_REQUEST);
    }
    if (!newEmail && !newUsername) {
      throw new HttpException('Either newEmail or newUsername must be provided', HttpStatus.BAD_REQUEST);
    }

    return {
      response:
        await this.usersService.updateByEmail({ userName, newEmail , newUsername } as UpdateUserEmailInput)
          ? { status: 200, message: "User Email or Username update Successfully" }
          : { status: 200, message: "User Not Found" }
    };
  }

  @Delete('delete-user')
  async deleteUser(@Query('username') username: string): Promise<any> {
    return {
      response:
        await this.usersService.deleteUserOnEntityField('username', username)
          ? { status: 200, message: "User Delete Successfully" }
          : { status: 200, message: "User Not Found" }
    };
  }

}