import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectEntity } from 'project/project.entity';
import { UserEntity } from 'user/user.entity';
import { UploadFilesEntity } from 'uploadFiles/uploadFiles.entity';

import { ImageService } from './image.service';
import { ImageEntity } from './image.entity';
import { ImageController } from './image.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserEntity, UploadFilesEntity, ImageEntity])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
