import { OmitType } from '@nestjs/swagger';
import { UserEntity } from 'user/user.entity';

export class PublicUserDto extends OmitType(UserEntity, [
  'id',
  'createDt',
  'updateDt',
  'deleteDt',
  'password',
  'isMember',
  'bookmarksId',
  'bookmarksId',
  'bookmarks',
  'projectsId',
  'projects',
]) {
  constructor(user: UserEntity) {
    super();
    this.email = user.email;
    this.nickname = user.nickname;
    this.avatarId = user.avatarId;
  }
}
