import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetUploadDto } from './uploadFiles.dto';
import { UploadFilesEntity } from './uploadFiles.entity';

@Injectable()
export class UploadFilesService {
  constructor(
    @InjectRepository(UploadFilesEntity)
    private readonly upload: Repository<UploadFilesEntity>
  ) {}

  async findOne(name: string) {
    const file = await this.upload.findOneBy({ filename: name });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async create(params: { files: Express.Multer.File[]; id: string }): Promise<any> {
    const { files, id } = params;

    const adfe = files.map((item) => {
      return this.saveLocalFileData({ fileData: item, own: id });
    });

    return await Promise.all(adfe);
  }

  async saveLocalFileData(params: { fileData: Express.Multer.File; own: string }) {
    const {
      fileData: { filename, path, mimetype },
      own,
    } = params;

    const newFile = await this.upload.create({ filename, path, mimetype, own });
    await this.upload.save(newFile);
    return newFile;
  }

  async findAll(id: string): Promise<GetUploadDto[]> {
    const findall = await this.upload.find({ where: { own: id } });
    return findall.map((i) => new GetUploadDto(i));
  }
}
