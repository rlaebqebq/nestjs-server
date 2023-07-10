import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'auth/auth.module';
import { UploadFilesEntity } from 'uploadFiles/uploadFiles.entity';
import { ProjectEntity } from 'project/project.entity';

import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UploadFilesEntity, ProjectEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
