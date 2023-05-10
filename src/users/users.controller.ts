import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AccessUserPayload } from './dto/access-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body('token') token:string): Promise<AccessUserPayload> {
    return await this.usersService.validateCognitoToken(token);
  }
}