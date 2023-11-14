import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { AppController } from './app.controller';
// import { Site } from './site/site.model';
import { MulterModule } from "@nestjs/platform-express";
import { SiteModule } from './site/site.module';
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'test',
    //   password: 'RM0PJop4',
    //   database: 'testdb',
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }), 
    SiteModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    })
    // MulterModule.register({
    //   dest: './uploads', // путь к папке для сохранения файлов
    // }),
  ],
  //controllers: [AppController],
  //providers: [SiteService],
})
export class AppModule {}
