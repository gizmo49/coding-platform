import TypeOrmConfig from './config/database/typeorm.config';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const configService = new ConfigService(process.env);

export default new TypeOrmConfig(configService).getOrmConfig();
