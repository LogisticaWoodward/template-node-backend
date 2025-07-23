import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Aplicar filtros globales
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Aplicar pipes globales
  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 PTD Vacíos Backend is running on: http://localhost:${port}`);
}

bootstrap();
