import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

import { CommonEntity } from 'common/common.entity';
import { UserEntity } from 'user/user.entity';
import { BookmarkEntity } from 'bookmark/bookmark.entity';
import { AttachFilesEntity } from 'attachFiles/attachFiles.entity';

@Entity({
  name: 'project',
  schema: 'public',
})
export class ProjectEntity extends CommonEntity {
  @ApiProperty({ type: 'boolean', required: true })
  @Column({
    type: 'boolean',
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isPublic: boolean;

  @ApiProperty({ type: 'string', required: true })
  @Column({
    type: 'varchar',
    length: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @ApiProperty({ required: true })
  @Column({
    type: 'varchar',
    length: 20,
  })
  @IsString()
  @IsNotEmpty()
  doi: string;

  @Column({
    type: 'simple-array',
  })
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: true })
  @IsString({ each: true })
  @IsNotEmpty()
  correspondence: string;

  @CreateDateColumn({
    type: 'datetime',
  })
  @ApiProperty({
    example: '2022-07-13T04:22:24.489Z',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  published: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  viewCount?: number;

  @Column({
    type: 'int',
    default: 0,
  })
  thumbCount?: number;

  @OneToMany(() => BookmarkEntity, (i: BookmarkEntity) => i.project, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  bookmarks: BookmarkEntity[];

  @ManyToOne(() => UserEntity, (i: UserEntity) => i.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => AttachFilesEntity, (i: AttachFilesEntity) => i.project, { onDelete: 'CASCADE' })
  attachFiles: AttachFilesEntity[];

  @Column({
    type: 'varchar',
    default: '',
  })
  thumbnail?: string;
}
