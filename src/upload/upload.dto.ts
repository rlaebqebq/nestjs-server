import { PickType } from '@nestjs/swagger';

import { UploadEntity } from './upload.entity';

export class UploadDto extends PickType(UploadEntity, ['filename', 'path', 'mimetype']) {
  constructor(u: UploadEntity) {
    super();
    this.filename = u.filename;
    this.path = u.path;
    this.mimetype = u.mimetype;
  }
}

export class GetUploadDto extends PickType(UploadEntity, ['mimetype', 'path', 'deleteDt']) {
  constructor(u: UploadEntity) {
    super();
    this.mimetype = u.mimetype;
    this.path = u.path;
    this.deleteDt = u.deleteDt;
  }
}
