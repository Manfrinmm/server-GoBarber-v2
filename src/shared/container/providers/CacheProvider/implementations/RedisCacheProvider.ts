import Redis, { Redis as RedisClient } from "ioredis";

import cacheConfig from "@config/cache";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

export default class RedisCaheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  save(key: string, value: string): Promise<void> {}

  recover(key: string): Promise<string> {}

  invalidate(key: string): Promise<void> {}
}
