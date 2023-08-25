import { Body, Controller, HttpException, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserEmailInput } from "src/util/interfaces";

@Controller('api')
export class CustomUserController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/users/update-email')
  async updateUserEmail(  @Query('userName') userName: string, @Query('newEmail') newEmail: string): Promise<any>{
    // Validate and process the request here
    if (!userName || !newEmail) {
      throw new HttpException('Missing userName or newEmail parameter', HttpStatus.BAD_REQUEST);
    }
    return {
      response :  await this.usersService.updateByEmail({userName, newEmail} as UpdateUserEmailInput) ? { status: 200, message: "User Email update Successfully" } : { status: 200, message: "User Not Found"  }
    }

  }

  @Post('delete-user')
  async deleteUser(@Query('username') username:string): Promise<any> {
    return {
      response: await this.usersService.deleteUserOnEntityField('username' , username) ? { status: 200, message: "User Delete Successfully" } : { status: 200, message: "User Not Found" }
    }
  }

}