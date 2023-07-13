import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { diskStorage } from 'multer';
import format from 'date-fns/format';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

import { LoggerMiddleware } from 'common/logger.middleware';
import { MemberGuard } from 'auth/member.guard.service';
import { AuthModule } from 'auth/auth.module';
import { UserModule } from 'user/user.module';
import { ProjectModule } from 'project/project.module';
import { UploadFilesModule } from 'uploadFiles/uploadFiles.module';
import { AttachFilesModule } from 'attachFiles/attachFiles.module';
import { BookmarkModule } from 'bookmark/bookmark.module';

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
        // synchronize: process.env.MODE == 'dev', //! set 'false' in production
        // dropSchema: true,
        synchronize: true,
        migrationsRun: true,
        logging: process.env.MODE == 'dev',
      }),
    }),
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          const uploadPath = 'uploads';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          callback(null, uploadPath);
        },
        filename: async (request, file, callback) => {
          const newName = format(new Date(), 'yyyy-MM-dd_HH:mm:ss.SSS');
          callback(null, `${newName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fieldNameSize: 200, // 필드명 사이즈 최대값 (기본값 100bytes)
        fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
        fileSize: 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
        files: 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
      },
    }),
    AuthModule,
    UserModule,
    ProjectModule,
    UploadFilesModule,
    BookmarkModule,
    AttachFilesModule,
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
