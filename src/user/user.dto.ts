import { PartialType, PickType } from '@nestjs/swagger';

import { UserEntity } from './user.entity';

export class UserDto extends PickType(UserEntity, ['email', 'isMember']) {
  constructor(user: UserEntity) {
    super();
    this.email = user.email;
    this.isMember = user.isMember;
  }
}

export class GetUserDto extends PickType(UserEntity, [
  'email',
  'avatarId',
  'nickname',
  'isMember',
  'bookmark',
  'projects',
]) {
  constructor(user: UserEntity) {
    super();
    this.email = user.email;
    this.avatarId = user.avatarId;
    this.nickname = user.nickname;
    this.isMember = user.isMember;
    this.bookmark = user.bookmark;
    this.projects = user.projects;
  }
}

export class JoinUserDto extends PickType(UserEntity, ['email', 'password', 'nickname']) {}

// export class UpdateUserDto extends PickType(UserEntity, ['password', 'avatarId', 'nickname']) {
//   constructor(user: UserEntity) {
//     super();
//     this.avatarId = user.avatarId;
//     this.nickname = user.nickname;
//   }
// }

export class UpdateUserDto extends PartialType(
  PickType(UserEntity, ['password', 'avatarId', 'nickname', 'bookmark', 'projects'] as const)
) {}
