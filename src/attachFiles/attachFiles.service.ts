import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UploadFilesDto } from 'uploadFiles/dto/uploadFiles.dto';
import { UploadFilesEntity } from 'uploadFiles/uploadFiles.entity';

import { CreateAttachFilesDto } from 'attachFiles/dto/CreateAttachFiles.dto';
import { AttachFilesEntity } from 'attachFiles/attachFiles.entity';

@Injectable()
export class AttachFilesService {
  constructor(
    @InjectRepository(AttachFilesEntity)
    private readonly attach: Repository<AttachFilesEntity>,

    @InjectRepository(UploadFilesEntity)
    private readonly upload: Repository<UploadFilesEntity>
  ) {}
  async saveFile(createAttachFileDto: CreateAttachFilesDto) {
    const attachFile = new AttachFilesEntity();
    attachFile.project = createAttachFileDto.project;

    const uploadFiles = [];
    for (const uploadFileDto of createAttachFileDto.uploadFiles) {
      const uploadFile = new UploadFilesEntity();
      uploadFile.path = uploadFileDto.path;
      // Set other properties of UploadFilesEntity if needed
      uploadFiles.push(uploadFile);
    }

    attachFile.uploadFiles = uploadFiles;
    await this.attach.save(attachFile);

    return attachFile;
  }

  async create(createAttachFileDto: CreateAttachFilesDto[]) {
    const fileList = [];

    for (const item of createAttachFileDto) {
      const fileData = await this.saveFile(item);
      fileList.push(fileData);
    }

    return fileList.map((item) => new UploadFilesDto(item));
  }
}
