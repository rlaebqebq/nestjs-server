import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { UserEntity } from 'user/user.entity';

export class UpdateUserDto extends PartialType(PickType(UserEntity, ['password', 'avatarId', 'nickname'] as const)) {
  @ApiProperty({
    example: '',
  })
  password: string;
}
