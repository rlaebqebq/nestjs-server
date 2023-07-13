import { PickType } from '@nestjs/swagger';

import { AttachFilesEntity } from 'attachFiles/attachFiles.entity';

export class PublicAttachFilesDto extends PickType(AttachFilesEntity, ['id', 'uploadFiles']) {
  constructor(i: AttachFilesEntity) {
    super();
    this.id = i.id;
    this.uploadFiles = i.uploadFiles;
  }
}
