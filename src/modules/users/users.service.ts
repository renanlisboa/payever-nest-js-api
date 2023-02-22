import { readFile, unlink } from 'fs/promises';
import { join } from 'path';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { axiosHttp } from '../../external';
import { UserResquestBody } from './types';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
    private readonly mailService: MailerService,
  ) {}

  async storeUser(body: UserResquestBody) {
    const model = new this.userModel(body);
    if (body.avatar) {
      const avatar = `${model.id}_${body.avatar.filename}`;
      model.set({ avatar });
    }
    const user = await model.save();
    if (!user) throw new ConflictException();
    this.client.emit('user_created', user);
    this.mailService.sendMail({
      from: 'from@example.com',
      to: 'to@example.com',
      subject: 'New user created',
      text: `A new user ${
        user.name
      } was created at ${new Date().toLocaleString()}`,
    });
    return user;
  }

  async findUserById(userId: string) {
    const { data } = await axiosHttp.get(`/users/${userId}`);
    if (!data) throw new NotFoundException();
    return data;
  }

  async findAvatarByUserId(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException();
    const [_, filename] = user.avatar.split('_');
    try {
      return readFile(join(__dirname, '..', '..', '..', 'uploads', filename));
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async removeAvatarByUserId(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException();
    const [_, filename] = user.avatar.split('_');
    user.set({ avatar: null });
    await user.save();
    try {
      await unlink(join(__dirname, '..', '..', '..', 'uploads', filename));
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
