import { ApiProperty, PickType } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';

import { ProjectEntity } from 'project/project.entity';

export class CreateProjectDto extends PickType(ProjectEntity, [
  'isPublic',
  'name',
  'doi',
  'correspondence',
  'published',
]) {
  @Column({
    type: 'simple-array',
  })
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: true })
  @IsString({ each: true })
  @IsNotEmpty()
  attachFiles: string;

  constructor() {
    super();
  }
}
