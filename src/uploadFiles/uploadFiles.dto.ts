import { PickType } from '@nestjs/swagger';

import { UploadFilesEntity } from './uploadFiles.entity';

export class UploadFilesDto extends PickType(UploadFilesEntity, ['filename', 'path', 'mimetype']) {
  constructor(u: UploadFilesEntity) {
    super();
    this.filename = u.filename;
    this.path = u.path;
    this.mimetype = u.mimetype;
  }
}

export class GetUploadDto extends PickType(UploadFilesEntity, ['id', 'path']) {
  constructor(u: UploadFilesEntity) {
    super();
    this.id = u.id;
    this.path = u.path;
  }
}
