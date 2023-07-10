import { ApiProperty, PickType } from '@nestjs/swagger';

import { BookmarkEntity } from 'bookmark/bookmark.entity';
import { IsUUID } from 'class-validator';

export class CreateBookmarkDto extends PickType(BookmarkEntity, []) {
  @ApiProperty({
    type: String,
    example: '',
  })
  @IsUUID()
  projectId: string;
  constructor() {
    super();
  }
}
