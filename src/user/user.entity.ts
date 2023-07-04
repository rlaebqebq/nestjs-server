import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';

import { CommonEntity } from 'common/common.entity';
import { UploadEntity } from 'upload/upload.entity';

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

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => UploadEntity, (i: UploadEntity) => i.own, {
    nullable: true,
  })
  public avatar?: UploadEntity;

  @ApiProperty({
    example: '',
  })
  @IsString()
  @Column({ type: 'text', nullable: true })
  public avatarId?: string;

  @Column({ type: 'json', nullable: true })
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  @IsOptional()
  @IsString({ each: true })
  bookmark: string;
}
