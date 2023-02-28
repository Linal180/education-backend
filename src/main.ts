import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: false 
  });
  const port = process.env.PORT || 3001;
  // app.enableCors();
  await app.listen(port);
  
}
bootstrap();
