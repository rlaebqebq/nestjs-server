import { OmitType } from '@nestjs/swagger';
import { UserEntity } from 'user/user.entity';

export class UserDto extends OmitType(UserEntity, ['password']) {
  constructor(user: UserEntity) {
    super();
    this.id = user.id;
    this.createDt = user.createDt;
    this.updateDt = user.updateDt;
    this.deleteDt = user.deleteDt;
    this.email = user.email;
    this.isMember = user.isMember;
    this.nickname = user.nickname;
    this.avatarId = user.avatarId;
    this.bookmarksId = user.bookmarksId;
    this.bookmarks = user.bookmarks;
    this.projectsId = user.projectsId;
    this.projects = user.projects;
  }
}
