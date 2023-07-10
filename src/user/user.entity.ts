import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, RelationId } from 'typeorm';
import { IsString, IsUUID } from 'class-validator';

import { CommonEntity } from 'common/common.entity';
import { ProjectEntity } from 'project/project.entity';
import { BookmarkEntity } from 'bookmark/bookmark.entity';

@Entity({
  name: 'user',
  schema: 'public',
})
export class UserEntity extends CommonEntity {
  @ApiProperty({
    description: '중복될 수 없음',
    example: 'email@gmail.com',
  })
  @IsString()
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  email: string;

  @ApiProperty({
    example: 'qwer1234!',
  })
  @IsString()
  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isMember: boolean;

  @ApiProperty({
    description: '중복될 수 없음',
  })
  @IsString()
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  nickname: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @Column({ type: 'text', nullable: true })
  avatarId?: string;

  @RelationId((i: UserEntity) => i.bookmarks)
  bookmarksId: string[];

  @OneToMany(() => BookmarkEntity, (i: BookmarkEntity) => i.user, {
    nullable: false,
  })
  @IsUUID()
  bookmarks!: BookmarkEntity[];

  @RelationId((i: UserEntity) => i.bookmarks)
  projectsId: string[];

  @OneToMany(() => ProjectEntity, (i) => i.user, {
    nullable: false,
  })
  projects!: ProjectEntity[];
}
