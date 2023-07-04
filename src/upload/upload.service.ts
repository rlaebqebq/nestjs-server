import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';

import { GetUploadDto } from './upload.dto';
import { UploadEntity } from './upload.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly upload: Repository<UploadEntity>
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

    if (!fs.existsSync(`uploads/${own}`)) {
      fs.mkdirSync(`uploads/${own}`, { recursive: true });
    }
    const returnpath = `uploads/${own}/${filename}`;
    const uploadPath = __dirname + `/../../${returnpath}`;
    await fs.writeFileSync(uploadPath, path);

    const newfilename = `${new Date().toISOString()}_${filename}`;

    const newFile = await this.upload.create({ filename: newfilename, path: returnpath, mimetype, own });
    await this.upload.save(newFile);
    return newFile;
  }

  async getFileById(path: string) {
    console.log('path', path);
    const file = await this.upload.findOneBy({ path });
    const uploadPath = __dirname + `/../../${file.path}`;
    const retrievedFile = fs.readFileSync(uploadPath, 'utf-8');

    if (!file && !retrievedFile) {
      throw new NotFoundException();
    }
    return retrievedFile;
  }

  async findAll(id: string): Promise<GetUploadDto[]> {
    const findall = await this.upload.find({ where: { own: id } });
    return findall.map((i) => new GetUploadDto(i));
  }
}
