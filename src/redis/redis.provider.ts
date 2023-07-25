import { ConfigService } from "@nestjs/config";
import { createClient } from 'redis';


export const RedisProvider = {
  provide: 'REDIS',
  useFactory: async (configService: ConfigService) => {
    console.log("INSIDE REDIS PROVIDER ??????????????>>>>>>>>>>>>>>>>>>>>>", configService.get('redis'));
    const client = createClient(configService.get('redis'));
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.connect();
    return client;
  },
  inject: [ConfigService],
}