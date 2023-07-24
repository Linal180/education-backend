import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService)
  const redisIoAdapter = new RedisIoAdapter(app, configService)
  app.useWebSocketAdapter(redisIoAdapter);
  await redisIoAdapter.connectToRedis();
  // app.enableCors(); // Enable CORS for all requests
  await app.listen(process.env.PORT || 3001);

}
bootstrap();

