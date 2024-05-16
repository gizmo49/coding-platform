import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { RedisCacheService } from './cache.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD,
          ttl: 60 * 3600 * 1000,
        };
      },
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheModule, RedisCacheService],
})
export class RedisCacheModule { }
