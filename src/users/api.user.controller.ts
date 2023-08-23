import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserEmailInput } from "src/util/interfaces";

@Controller('api')
export class CustomUserController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/users/update-email')
  async updateUserEmail(@Body() payload:UpdateUserEmailInput ): Promise<any>{
    return {
      response :  await this.usersService.updateByEmail(payload) ? { status: 200, message: "User Email update Successfully" } : { status: 404, message: "User Not Found"  }
    }

  }

}