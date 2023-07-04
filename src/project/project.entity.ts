import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity } from 'typeorm';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { CommonEntity } from 'common/common.entity';

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
  @ApiProperty({})
  @IsString({ each: true })
  @IsNotEmpty()
  correspondence: string[];

  @CreateDateColumn({
    type: 'datetime',
  })
  @ApiProperty({
    example: '2022-07-13T04:22:24.489Z',
    required: false,
  })
  published: Date;

  @Column({ type: 'json', nullable: false })
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: true, description: '파일 경로' })
  @IsOptional()
  @IsString({ each: true })
  imageFiles: string[];

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  @IsOptional()
  registerBy?: string;
}
