import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { ProjectEntity } from 'project/project.entity';

export class ProjectDto extends OmitType(ProjectEntity, ['createDt', 'updateDt', 'deleteDt']) {
  @ApiProperty({
    type: String,
    example: '',
  })
  @IsUUID()
  userId: string;

  constructor(i: ProjectEntity) {
    super();
    this.isPublic = i.isPublic;
    this.id = i.id;
    this.name = i.name;
    this.doi = i.doi;
    this.correspondence = i.correspondence;
    this.published = i.published;
    this.viewCount = i.viewCount;
    this.thumbCount = i.thumbCount;
    this.user = i.user;
  }
}
