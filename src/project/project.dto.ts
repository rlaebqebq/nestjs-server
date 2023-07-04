import { OmitType, PickType } from '@nestjs/swagger';

import { ProjectEntity } from './project.entity';

export class ProjectDto extends OmitType(ProjectEntity, ['createDt', 'updateDt', 'deleteDt']) {
  constructor(t: ProjectEntity) {
    super();
    this.id = t.id;
    this.name = t.name;
    this.imageFiles = t.imageFiles;
  }
}

export class CreateProjectDto extends OmitType(ProjectEntity, ['id', 'createDt', 'updateDt', 'deleteDt']) {}
export class CreatedProjectDto extends OmitType(ProjectEntity, ['createDt', 'updateDt', 'deleteDt', 'imageFiles']) {}

export class UpdateProjectDto extends PickType(ProjectEntity, []) {}

export class ProjectListDto extends PickType(ProjectEntity, ['id', 'name']) {}
