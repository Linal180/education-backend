import { Body, Controller, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserEmailInput } from "src/util/interfaces";

@Controller('api')
export class CustomUserController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/users/update-email')
  async updateUserEmail(@Body() payload:UpdateUserEmailInput ): Promise<any>{
    return {
      response :  await this.usersService.updateByEmail(payload) ? { status: 200, message: "User Email update Successfully" } : { status: 200, message: "User Not Found"  }
    }

  }

  @Post('delete-user')
  async deleteUser(@Query('username') username:string): Promise<any> {
    return {
      response: await this.usersService.deleteUserOnEntityField('username' , username) ? { status: 200, message: "User Delete Successfully" } : { status: 200, message: "User Not Found" }
    }
  }

}