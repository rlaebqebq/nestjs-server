import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'auth/auth.module';
import { UploadEntity } from 'upload/upload.entity';
import { ProjectEntity } from 'project/project.entity';

import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UploadEntity, ProjectEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
