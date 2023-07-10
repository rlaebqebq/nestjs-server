import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Payload } from 'type/jwt.payload';
import { JwtStrategy } from 'auth/jwt.strategy';
import { UserEntity } from 'user/user.entity';

import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy
  ) {}

  async jwtLogin(loginDto: AuthDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.jwtStrategy.validate(loginDto);

    const isValiedPassword: boolean = await bcrypt.compare(password, user.password);
    if (!isValiedPassword) throw new NotFoundException('비밀번호를 확인해주세요.');

    const payload: Payload = { sub: user.id, email, isMember: user.isMember };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async jwtLogout() {
    return { token: '' };
  }
}
