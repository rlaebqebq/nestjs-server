import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'user/user.entity';
import { UploadEntity } from 'upload/upload.entity';

import { ProjectEntity } from './project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserEntity, UploadEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
