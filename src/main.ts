import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  
  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Woodward Backend Template')
    .setDescription('Template base para proyectos backend en NestJS con autenticación completa')
    .setVersion('1.0')
    .addTag('Auth', 'Endpoints de autenticación')
    .addTag('Users', 'Gestión de usuarios')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Woodward Backend Template is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
}

bootstrap();
