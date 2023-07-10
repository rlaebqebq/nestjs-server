import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectEntity } from 'project/project.entity';

import { UploadFilesEntity } from './uploadFiles.entity';
import { UploadFilesController } from './uploadFiles.controller';
import { UploadFilesService } from './uploadFiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadFilesEntity, ProjectEntity])],
  controllers: [UploadFilesController],
  providers: [UploadFilesService],
  exports: [UploadFilesService],
})
export class UploadFilesModule {}
