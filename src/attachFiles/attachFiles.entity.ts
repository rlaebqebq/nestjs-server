import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { CommonEntity } from 'common/common.entity';
import { ProjectEntity } from 'project/project.entity';
import { UploadFilesEntity } from 'uploadFiles/uploadFiles.entity';

@Entity({
  name: 'attach_files',
  schema: 'public',
})
export class AttachFilesEntity extends CommonEntity {
  @ManyToOne(() => ProjectEntity, (project: ProjectEntity) => project.attachFiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: ProjectEntity;

  @ManyToMany(() => UploadFilesEntity, (uploadFile) => uploadFile.attachFiles, { onDelete: 'CASCADE' })
  @JoinTable()
  uploadFiles: UploadFilesEntity[];
}
