import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class UserApiDocs {
  /** join api */
  static JoinOperation() {
    return {
      summary: '회원가입',
      description: '중복될 수 없는 email로 회원가입 합니다.',
    };
  }

  /** login api */
  static LoginOperation() {
    return {
      summary: '로그인',
      description: '이메일, 비밀번호로 로그인하고 JWT를 반환 받습니다.',
    };
  }
  static LoginOkRes() {
    class JwtResponse {
      @ApiProperty()
      token: string;
    }

    return {
      description: 'Ok',
      type: JwtResponse,
    };
  }

  /** read api */
  static RetrieveOperation() {
    return {
      summary: '사용자 정보 조회',
    };
  }
  static RetrieveOkRes() {
    return {
      description: 'Ok',
      // type: responseFormatter(UserDto),
      type: UserDto,
    };
  }
}
