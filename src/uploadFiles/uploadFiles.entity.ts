import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { IsOptional, IsString, IsUUID } from 'class-validator';

import { CommonEntity } from 'common/common.entity';

@Entity({
  name: 'upload_files',
  schema: 'public',
})
export class UploadFilesEntity extends CommonEntity {
  @IsString()
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  filename: string;

  @ApiProperty({
    example: '',
  })
  @Column({
    type: 'text',
  })
  path: string;

  @ApiProperty({
    example: '',
  })
  @Column({
    type: 'varchar',
  })
  mimetype: string;

  @Column({
    type: 'uuid',
  })
  @IsUUID()
  own: string;
}

export class FileUploadEntity {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class FilesUploadEntity {
  @Column({ type: 'json', nullable: true })
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  files?: Express.Multer.File[];
}
