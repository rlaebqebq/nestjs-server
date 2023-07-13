import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'user/user.entity';

export class JoinUserDto extends PickType(UserEntity, ['email', 'password', 'nickname']) {}
