import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { CommonEntity } from 'common/common.entity';
import { UserEntity } from 'user/user.entity';

@Entity({
  name: 'project',
})
export class ProjectEntity extends CommonEntity {
  @ApiProperty({ required: true })
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
    type: 'simple-array',
  })
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: true })
  @IsString({ each: true })
  @IsNotEmpty()
  imageFiles: string;

  @Column({ type: 'uuid', nullable: false })
  registerById: string;

  @ManyToOne(() => UserEntity, (i) => i.projects)
  @JoinColumn({ name: 'registerById' })
  registerBy: UserEntity;

  @Column({
    type: 'varchar',
  })
  thumbnail?: string;

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

  @BeforeInsert()
  @BeforeUpdate()
  setThumbnailFromImageFiles() {
    if (this.imageFiles) {
      const imageArray = this.imageFiles.split(',');
      if (Array.isArray(imageArray) && imageArray.length > 0) {
        this.thumbnail = imageArray[0];
      }
    }
  }
}
