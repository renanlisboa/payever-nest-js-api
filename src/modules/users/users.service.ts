import { Injectable } from '@nestjs/common';

import { UserResquestBody } from './types';

@Injectable()
export class UsersService {
  store(body: UserResquestBody): string {
    return 'This action stores a new user';
  }
}
