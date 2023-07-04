import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as mime from 'mime-types';
import { diskStorage } from 'multer';

import { LoggerMiddleware } from 'common/logger.middleware';
import { MemberGuard } from 'auth/member.guard.service';
import { AuthModule } from 'auth/auth.module';
import { UserModule } from 'user/user.module';
import { ProjectModule } from 'project/project.module';
import { UploadModule } from 'upload/upload.module';

import { AppController } from 'app.controller';
import { AppService } from 'app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (): Promise<TypeOrmModuleOptions> => ({
        type: 'mariadb',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        namingStrategy: new SnakeNamingStrategy(),
        autoLoadEntities: true,
        entities: [__dirname + '*.entity{.ts,.js}'],
        synchronize: process.env.MODE == 'dev', //! set 'false' in production
        logging: process.env.MODE == 'dev',
      }),
    }),
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, './upload');
        },
        filename(req, file, callback) {
          callback(null, `${new Date().getTime()}.${mime.extension(file.mimetype)}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
        files: 1,
      },
      fileFilter(req, file, callback) {
        callback(null, true);
      },
    }),
    AuthModule,
    UserModule,
    ProjectModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: MemberGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
