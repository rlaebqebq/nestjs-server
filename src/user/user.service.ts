import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UploadEntity } from 'upload/upload.entity';
import { ProjectEntity } from 'project/project.entity';

import { JoinUserDto, UpdateUserDto } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,

    @InjectRepository(UploadEntity)
    private readonly upload: Repository<UploadEntity>,

    @InjectRepository(ProjectEntity)
    private readonly project: Repository<ProjectEntity>
  ) {}

  async join(joinUserDto: JoinUserDto) {
    const { email, password, nickname } = joinUserDto;

    const isEmailExist: number = await this.user.count({
      where: { email },
    });
    if (0 < isEmailExist) throw new BadRequestException('duplicate email');

    const isNicknameExist: number = await this.user.count({
      where: { nickname },
    });
    if (0 < isNicknameExist) throw new BadRequestException('duplicate nickname');

    const hasedPassword = await bcrypt.hash(password, 10);
    const user = this.user.create({ ...joinUserDto, password: hasedPassword });

    await user.save();
  }

  async update(id: string, update: UpdateUserDto) {
    const { password, nickname, avatarId, bookmark } = update;

    if (password) update.password = await bcrypt.hash(update.password, 10);

    if (nickname) {
      const isNicknameExist = this.user.findOne({ where: { nickname } });
      if (isNicknameExist) throw new BadRequestException('duplicate nickname');
    }

    if (avatarId) {
      const isHisOwn = await this.upload.findOne({ where: { own: id, path: avatarId } });
      if (!isHisOwn) throw new BadRequestException();
    }

    if (bookmark) {
      const bookmarkArrUnique = bookmark.split(',').filter((val, idx) => {
        return bookmark.split(',').indexOf(val) === idx;
      });
      const projects = await this.project.find();

      const isProjectExist = bookmarkArrUnique.every((bookmarkId) => {
        return projects.some((project) => project.id === bookmarkId);
      });
      if (!isProjectExist) throw new NotFoundException(`NotFound ${id}`);
    }

    const originUpdate = { ...update };
    for (const key in originUpdate) {
      if (update[key].length < 1) await delete originUpdate[key];
    }

    for (const key in update) {
      if (update[key].length < 1) await delete update[key];
    }

    const isUserExist = this.user.findOne({ where: { id } });
    if (isUserExist) await this.user.update({ id }, update);
    else throw new NotFoundException(`NotFound ${id}`);

    return { id, ...originUpdate };
  }
}
