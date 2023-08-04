import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;
  app.enableCors(); // Enable CORS for all requests ...Khalid on staging branch....
  await app.listen(port);
}
bootstrap();

