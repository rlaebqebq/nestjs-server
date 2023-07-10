import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { IPagination, IPaginationParams } from 'type';

import { UploadFilesEntity } from 'uploadFiles/uploadFiles.entity';

import { CreateProjectDto, ProjectDto, ProjectListDto } from './project.dto';
import { ProjectEntity } from './project.entity';
import { UserEntity } from 'user/user.entity';

interface IFindAll extends IPaginationParams {
  id?: string;
  orderBy?: string;
}

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly project: Repository<ProjectEntity>,

    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,

    @InjectRepository(UploadFilesEntity)
    private readonly upload: Repository<UploadFilesEntity>
  ) {}

  async create({ create, id }: { create: CreateProjectDto; id: string }) {
    const { name } = create;
    const isExist = await this.project.findOne({ where: { name }, select: { name: true } });
    const isUserExist = await this.user.findOne({ where: { id } });
    if (isExist) throw new BadRequestException(`Duplicate name, ${name}`);

    const newProject: CreateProjectDto = this.project.create({ ...create, user: isUserExist });
    await newProject.save();

    return newProject;
  }

  async findAll({ search, view, pageParam, id, orderBy }: IFindAll): Promise<IPagination<ProjectListDto[]>> {
    let findOption: FindManyOptions = { relations: ['user'] };
    if (search) findOption = { where: { name: Like(`%${search}%`) } };
    if (id) findOption = { ...findOption, where: { user: id } };
    if (orderBy) {
      if (orderBy === 'viewCount') findOption = { ...findOption, order: { viewCount: 'DESC' } };
    }
    if (view) {
      findOption = { ...findOption, take: view };
      if (pageParam) findOption = { ...findOption, skip: view * pageParam };
    }

    const [project, total] = await this.project.findAndCount(findOption);
    return {
      totalCount: total,
      totalPage: Math.ceil(total / view) || 1,
      pageParam: pageParam || 0,
      view: view || total,
      list: project.map((i) => new ProjectListDto(i)),
    };
  }

  async findOne(id: string): Promise<ProjectDto> {
    const project = await this.project.findOne({ where: { id }, relations: ['user'] });
    if (!project) throw new NotFoundException(`NotFound ${id}`);

    const { viewCount, user, ...res } = project;

    const view: ProjectEntity = {
      viewCount: viewCount + 1,
      user,
      ...res,
    } as ProjectEntity;

    try {
      await this.project.update(id, { viewCount: viewCount + 1 });
    } catch (e) {
      return e;
    }

    return new ProjectDto(view);
  }

  async update(id: string, update: Partial<CreateProjectDto>): Promise<Partial<ProjectDto>> {
    const { name } = update;
    if (name) {
      const isExist = await this.project.findOne({ where: { name }, select: { name: true } });
      if (isExist) throw new BadRequestException(`Duplicate Name ${name}`);
    }

    const project = await this.project.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`NotFound ${id}`);

    try {
      await this.project.update(id, update);
    } catch (e) {
      return e;
    }
    return { id, ...CreateProjectDto };
  }

  async remove(id: string) {
    const project = await this.project.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`NotFound ${id}`);

    project.softRemove();
    return { id: project.id, deleteDt: project.deleteDt };
  }
}
