import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { Site } from './site/site.model';
import { SiteService } from './site/site.service';
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'RM0PJop4',
      database: 'testdb',
      logging: true,
      synchronize: true,
      entities: [Site],
    }),
    // MulterModule.register({
    //   dest: './uploads', // путь к папке для сохранения файлов
    // }),
  ],
  controllers: [AppController],
  providers: [SiteService],
})
export class AppModule {}
