import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';

import { CommonEntity } from 'common/common.entity';
import { ProjectEntity } from 'project/project.entity';

@Entity({
  name: 'user',
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

  @Column({
    type: 'simple-array',
  })
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  @IsString({ each: true })
  bookmark: string | string[];

  @OneToMany(() => ProjectEntity, (i) => i.registerBy)
  projects: ProjectEntity[];
}
