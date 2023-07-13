import { Column, Entity, ManyToMany } from 'typeorm';
import { IsString, IsUUID } from 'class-validator';

import { CommonEntity } from 'common/common.entity';
import { AttachFilesEntity } from 'attachFiles/attachFiles.entity';

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

  @Column({
    type: 'varchar',
  })
  path: string;

  @Column({
    type: 'varchar',
  })
  mimetype: string;

  @Column({
    type: 'uuid',
  })
  @IsUUID()
  userId: string;

  @ManyToMany(() => AttachFilesEntity, (attachFile) => attachFile.uploadFiles)
  attachFiles: AttachFilesEntity[];
}
