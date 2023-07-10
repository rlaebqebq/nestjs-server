import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsUUID } from 'class-validator';

import { CommonEntity } from 'common/common.entity';
import { ProjectEntity } from 'project/project.entity';
import { UserEntity } from 'user/user.entity';

@Entity({
  name: 'bookmark',
  schema: 'public',
})
export class BookmarkEntity extends CommonEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @IsUUID()
  user: UserEntity;

  @ManyToOne(() => ProjectEntity, { lazy: true })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
