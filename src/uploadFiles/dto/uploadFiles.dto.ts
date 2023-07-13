import { ApiProperty, PickType } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsOptional } from 'class-validator';

import { UploadFilesEntity } from 'uploadFiles/uploadFiles.entity';

export class UploadFilesDto extends PickType(UploadFilesEntity, ['path']) {
  @Column({ type: 'json', nullable: true })
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  files?: Express.Multer.File[];

  constructor(u: UploadFilesEntity) {
    super();
    this.path = u.path;
  }
}
