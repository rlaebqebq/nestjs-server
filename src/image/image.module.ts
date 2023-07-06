import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'project/project.entity';
import { UserEntity } from 'user/user.entity';
import { UploadEntity } from 'upload/upload.entity';
import { ImageEntity } from 'image/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserEntity, UploadEntity, ImageEntity])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
