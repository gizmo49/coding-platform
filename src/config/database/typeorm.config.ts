import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { NodeEnvironment } from '../enums/node-environment.enum';

export default class TypeOrmConfig {
  constructor(private readonly configService: ConfigService) {}

  isNodeEnvironment(desiredMode: NodeEnvironment): boolean {
    const currentMode: NodeEnvironment =
      this.configService.get<NodeEnvironment>('NODE_ENV');

    if (!(currentMode in NodeEnvironment)) {
      throw new Error(`Invalid application mode "${currentMode}"`);
    }

    return currentMode === desiredMode;
  }

  getOrmConfig(): TypeOrmModuleOptions {
    const ssl = {
      require: true,
      rejectUnauthorized: false,
    };

    return {
      type: 'mysql',
      host: this.configService.get('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USERNAME'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: this.configService.get('DATABASE_NAME'),
      ssl: this.isNodeEnvironment(NodeEnvironment.development) ? false : ssl,
      entities: [
        __dirname + '../../../resources/**/*.entity{.ts,.js}',
        './build/src/resources/entity/*.js',
      ],
      synchronize: true,
      logging: this.isNodeEnvironment(NodeEnvironment.test) ? false : true,
      dropSchema: this.isNodeEnvironment(NodeEnvironment.test),
      migrationsTableName: 'migrations',
      migrationsRun: true,
      migrations: ['dist/**/migrations/*.{ts,js}'],
      cli: {
        migrationsDir: 'src/migrations',
      },
      keepConnectionAlive: this.isNodeEnvironment(NodeEnvironment.test),
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return new TypeOrmConfig(configService).getOrmConfig();
  },
  inject: [ConfigService],
};
