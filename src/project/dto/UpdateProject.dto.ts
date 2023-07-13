import { PickType } from '@nestjs/swagger';

import { ProjectEntity } from 'project/project.entity';

export class UpdateProjectDto extends PickType(ProjectEntity, []) {}
