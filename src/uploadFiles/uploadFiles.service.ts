import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UploadFilesEntity } from 'uploadFiles/uploadFiles.entity';
import { FindUploadDto } from 'uploadFiles/dto/FindUpload.dto';
import { UploadFilesDto } from 'uploadFiles/dto/uploadFiles.dto';

@Injectable()
export class UploadFilesService {
  constructor(
    @InjectRepository(UploadFilesEntity)
    private readonly upload: Repository<UploadFilesEntity>
  ) {}

  async create(params: { files: Express.Multer.File[]; id: string }): Promise<UploadFilesDto[]> {
    const { files, id } = params;

    if (files.length < 1) throw new BadRequestException();

    const fileList = [];
    for (const item of files) {
      const fileData = await this.saveLocalFileData({ fileData: item, userId: id });
      fileList.push(fileData);
    }

    return fileList.map((item) => {
      return new UploadFilesDto(item);
    });
  }

  async saveLocalFileData(params: { fileData: Express.Multer.File; userId: string }) {
    const {
      fileData: { filename, path, mimetype },
      userId,
    } = params;

    const newFile = await this.upload.create({ filename, path, mimetype, userId });
    await this.upload.save(newFile);
    return newFile;
  }

  async findAll(id: string): Promise<FindUploadDto[]> {
    const findall = await this.upload.find({ where: { userId: id } });
    return findall.map((i) => new FindUploadDto(i));
  }
}
