import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'user/user.entity';

import { ProjectEntity } from 'project/project.entity';
import { BookmarkController } from 'bookmark/bookmark.controller';
import { BookmarkService } from 'bookmark/bookmark.service';
import { BookmarkEntity } from 'bookmark/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkEntity, UserEntity, ProjectEntity])],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
