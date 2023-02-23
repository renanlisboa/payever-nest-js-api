import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserSchema } from './user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri: config.get<string>('MONGODB_URI'),
          }),
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            transport: {
              host: config.get<string>('MAILER_HOST'),
              auth: {
                user: config.get<string>('MAILER_USER'),
                pass: config.get<string>('MAILER_PASS'),
              },
            },
          }),
        }),
        ClientsModule.registerAsync([
          {
            name: 'USER_SERVICE',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBIT_MQ_URL')],
                queue: 'main_queue',
                queueOptions: {
                  durable: false,
                },
              },
            }),
          },
        ]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should store a user', async () => {
    const body = {
      name: 'John',
      job: 'Software Engineer',
    };

    const user = await service.storeUser(body);

    expect(user.id).not.toBeNull();
    expect(user.name).not.toBeNull();
    expect(user.job).not.toBeNull();
  });

  it('should get an user by id from external api', async () => {
    const id = '2';

    const user = await service.findUserById(id);

    expect(user.data).toBeDefined();
    expect(user.data.id).toBe(2);
  });
});
