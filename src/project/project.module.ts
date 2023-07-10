import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'user/user.entity';
import { UploadFilesEntity } from 'uploadFiles/uploadFiles.entity';
import { BookmarkEntity } from 'bookmark/bookmark.entity';

import { ProjectEntity } from './project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserEntity, BookmarkEntity, UploadFilesEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
