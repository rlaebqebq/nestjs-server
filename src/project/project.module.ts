import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'user/user.entity';
import { UploadFilesEntity } from 'uploadFiles/uploadFiles.entity';
import { BookmarkEntity } from 'bookmark/bookmark.entity';
import { AttachFilesEntity } from 'attachFiles/attachFiles.entity';

import { ProjectEntity } from 'project/project.entity';
import { ProjectController } from 'project/project.controller';
import { ProjectService } from 'project/project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity, UserEntity, BookmarkEntity, UploadFilesEntity, AttachFilesEntity]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
