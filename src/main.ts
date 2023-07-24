import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const redisIoAdapter = new RedisIoAdapter(app, configService);
  app.useWebSocketAdapter(redisIoAdapter);
  await redisIoAdapter.connectToRedis();
  app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Adjust the allowed methods as needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Adjust the allowed headers as needed
    credentials: true, // Allow credentials like cookies, if applicable
    preflightContinue: false, // Set this to true if you want to handle preflight requests explicitly
    optionsSuccessStatus: 200, // Set the response status code for successful OPTIONS requests
  });
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
