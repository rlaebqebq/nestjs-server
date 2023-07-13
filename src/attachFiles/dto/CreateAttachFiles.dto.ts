import { PickType } from '@nestjs/swagger';

import { AttachFilesEntity } from 'attachFiles/attachFiles.entity';

export class CreateAttachFilesDto extends PickType(AttachFilesEntity, ['id', 'project', 'uploadFiles']) {
  constructor() {
    super();
  }
}
