import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //app.setBaseViewsDir(join(__dirname, '../views'));
  //app.useStaticAssets(join(__dirname , "../../uploads"));
  // app.useStaticAssets(join(__dirname , "../../history_sites"));
  // app.useStaticAssets(join(__dirname , "../../static"));
  app.setBaseViewsDir(join(__dirname, '../../views'));
  app.setViewEngine('pug');
  await app.listen(3000);
}
bootstrap();
