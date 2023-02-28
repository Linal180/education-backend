import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3001;
  app.enableCors({
    origin: 'https://educationplatform.vercel.app',
  });
  await app.listen(port);
  
}
bootstrap();
