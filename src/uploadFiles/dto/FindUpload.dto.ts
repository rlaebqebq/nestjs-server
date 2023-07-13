import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { UploadFilesEntity } from 'uploadFiles/uploadFiles.entity';

export class FindUploadDto extends PickType(UploadFilesEntity, ['path', 'mimetype']) {
  @ApiProperty({
    example: '',
  })
  @IsString()
  path: string;

  constructor(u: UploadFilesEntity) {
    super();
    this.path = u.path;
    this.mimetype = u.mimetype;
  }
}
