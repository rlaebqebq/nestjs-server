import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from 'app.module';
import { HttpExceptionFilter } from 'common/http-exception.filter';
import { ResponseInterceptor } from 'common/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validationError: {
        value: true,
        target: true,
      },
      enableDebugMessages: true,
      skipNullProperties: true,
    })
  );

  SwaggerModule.setup(
    '/docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Medicon record API')
        .setDescription('Nestjs, Typeorm, Swagger')
        .setVersion('1.0')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'JWT Token',
            in: 'header',
          },
          'Access Token'
        )
        .build()
    )
  );

  await app.listen(process.env.SWAGGER_PORT || 4000);
}
bootstrap();
