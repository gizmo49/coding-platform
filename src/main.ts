import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import docModels from './common/dtos';

import { AppModule } from './resources/app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Task Management System')
        .setDescription('Task Management System API documentation')
        .setVersion('1.0')
        .addTag('TMS')
        .build();

    const document = SwaggerModule.createDocument(app, options, {
        ignoreGlobalPrefix: true,
        extraModels: docModels,
    });

    app.setGlobalPrefix('/task-ms/');
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    SwaggerModule.setup('/task-ms/swagger', app, document);

    await app.listen(port);
}
bootstrap();
