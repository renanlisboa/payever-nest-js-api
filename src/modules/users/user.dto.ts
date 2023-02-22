export class UserDto {
  avatar: string;
  name: string;
  job: string;

  constructor(user: UserDto) {
    this.avatar = user.avatar;
    this.name = user.name;
    this.job = user.job;
  }
}
