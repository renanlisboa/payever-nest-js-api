import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  Request,
  Response,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { HttpResponse, UserResquestBody } from './types';

@Controller('users')
export class UsersController {
  constructor(private userservice: UsersService) {}

  @Post()
  async store(
    @Body() body: UserResquestBody,
  ): Promise<HttpResponse> {
    try {
      const data = this.userservice.store(body);
      return {
        statusCode: 201,
        data,
      };
    } catch (error) {
      return {
        statusCode: 400,
        data: null,
      };
    }
  }
}
