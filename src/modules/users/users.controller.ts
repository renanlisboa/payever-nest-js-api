import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  Delete,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { HttpResponse, UserResquestBody } from './types';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private userservice: UsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      dest: './uploads',
    }),
  )
  async store(
    @Body() body: UserResquestBody,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<HttpResponse> {
    try {
      await this.userservice.storeUser({ ...body, avatar });
      return {
        statusCode: 201,
        data: null,
      };
    } catch (error) {
      return {
        statusCode: 400,
        data: null,
      };
    }
  }

  @Get(':userId')
  async getById(@Param('userId') userId: string) {
    try {
      const user = await this.userservice.findUserById(userId);
      return {
        statusCode: 200,
        user,
      };
    } catch (error) {
      return {
        statusCode: 404,
        data: null,
      };
    }
  }

  @Get(':userId/avatar')
  async getAvatarByUserId(@Param('userId') userId: string) {
    try {
      const avatar = await this.userservice.findAvatarByUserId(userId);
      return {
        statusCode: 200,
        data: { avatar },
      };
    } catch (error) {
      return {
        statusCode: 404,
        data: null,
      };
    }
  }

  @Delete(':userId/avatar')
  async removeAvatarByUserId(@Param('userId') userId: string) {
    try {
      await this.userservice.removeAvatarByUserId(userId);
      return {
        statusCode: 204,
        data: null,
      };
    } catch (error) {
      return {
        statusCode: 404,
        data: null,
      };
    }
  }
}
