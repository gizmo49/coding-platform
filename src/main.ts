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
        .setTitle('Coding Platform')
        .setDescription('Coding Platform API documentation')
        .setVersion('1.0')
        .addTag('Coding Platform')
        .build();


    app.setGlobalPrefix('/coding-platform/');
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
   

    const document = SwaggerModule.createDocument(app, options, {
        ignoreGlobalPrefix: false,
        extraModels: docModels,
    });

    SwaggerModule.setup('/coding-platform/swagger', app, document);

    await app.listen(port);
}
bootstrap();
