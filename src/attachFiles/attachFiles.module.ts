import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadFilesEntity } from 'uploadFiles/uploadFiles.entity';

import { AttachFilesService } from 'attachFiles/attachFiles.service';
import { AttachFilesController } from 'attachFiles/attachFiles.controller';
import { AttachFilesEntity } from 'attachFiles/attachFiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttachFilesEntity, UploadFilesEntity])],
  controllers: [AttachFilesController],
  providers: [AttachFilesService],
})
export class AttachFilesModule {}
