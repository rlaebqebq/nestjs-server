import { OmitType, PickType } from '@nestjs/swagger';

import { ProjectEntity } from './project.entity';

export class ProjectDto extends OmitType(ProjectEntity, ['createDt', 'updateDt', 'deleteDt']) {
  constructor(t: ProjectEntity) {
    super();
    this.id = t.id;
    this.name = t.name;
    this.doi = t.doi;
    this.correspondence = t.correspondence;
    this.published = t.published;
    this.viewCount = t.viewCount;
    this.thumbCount = t.thumbCount;
    this.registerBy = t.registerBy;
  }
}

export class CreateProjectDto extends OmitType(ProjectEntity, ['id', 'createDt', 'updateDt', 'deleteDt']) {}
export class CreatedProjectDto extends OmitType(ProjectEntity, ['createDt', 'updateDt', 'deleteDt']) {}

export class UpdateProjectDto extends PickType(ProjectEntity, []) {}

export class ProjectListDto extends PickType(ProjectEntity, [
  'id',
  'name',
  'published',
  'correspondence',
  'doi',
  'viewCount',
]) {
  constructor(t: ProjectEntity) {
    super();
    this.id = t.id;
    this.name = t.name;
    this.published = t.published;
    this.correspondence = t.correspondence;
    this.doi = t.doi;
    this.viewCount = t.viewCount;
  }
}
