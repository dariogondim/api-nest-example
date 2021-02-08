import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './modules/app.module';

declare const module: any;

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { cors: true });

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('EU/SA')
    .setDescription('EU/SA API Documentation')
    .setVersion('1.0')
    .setSchemes('http', 'https')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/doc', app, document);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();