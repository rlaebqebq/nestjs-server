import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectEntity } from 'project/project.entity';
import { UserEntity } from 'user/user.entity';

import { BookmarkEntity } from './bookmark.entity';
import { CreateBookmarkDto } from './bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private readonly bookmark: Repository<BookmarkEntity>,

    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,

    @InjectRepository(ProjectEntity)
    private readonly project: Repository<ProjectEntity>
  ) {}
  async create({ id, createTeamDto }: { id: string; createTeamDto: CreateBookmarkDto }) {
    const { projectId } = createTeamDto;
    const isUserExist = await this.user.findOne({ where: { id: id } });
    const isProjectExist = await this.project.findOne({ where: { id: projectId } });
    if (!isProjectExist || !isUserExist) throw new NotFoundException(`Not found, ${projectId}`);

    const bookmark = this.bookmark.create({ project: isProjectExist, user: isUserExist });
    await bookmark.save();
    return bookmark.id;
  }

  findAll() {
    return `This action returns all bookmark`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove({ id, projectId }: { id: string; projectId: string }) {
    return 'remove';
  }
}
