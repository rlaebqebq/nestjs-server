import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'user/user.entity';

export class AuthDto extends PickType(UserEntity, ['email', 'password']) {}
