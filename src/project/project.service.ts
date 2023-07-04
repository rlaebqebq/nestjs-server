import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { IPagination, IPaginationParams } from 'type';

import { UploadEntity } from 'upload/upload.entity';

import { CreateProjectDto, ProjectDto } from './project.dto';
import { ProjectEntity } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly project: Repository<ProjectEntity>,
    //
    // @InjectRepository(UserEntity)
    // private readonly user: Repository<UserEntity>,

    @InjectRepository(UploadEntity)
    private readonly upload: Repository<UploadEntity>
  ) {}

  async create({ create, id }: { create: CreateProjectDto; id: string }): Promise<any> {
    const { name, imageFiles } = create;
    console.log(imageFiles);

    const isExist = await this.project.findOne({ where: { name }, select: { name: true } });
    if (isExist) throw new BadRequestException(`Duplicate name, ${name}`);

    const newProject = this.project.create({ name, registerBy: id, imageFiles });
    await newProject.save();
    return newProject;
  }

  async findAll({ search, view, page }: IPaginationParams): Promise<IPagination<ProjectDto[]>> {
    let findOption: FindManyOptions = {};
    if (search) findOption = { where: { name: Like(`%${search}%`) } };
    if (view) {
      findOption = { ...findOption, take: view };
      if (page) findOption = { ...findOption, skip: view * page };
    }

    const [project, total] = await this.project.findAndCount(findOption);
    return {
      totalCount: total,
      totalPage: Math.ceil(total / view) || 1,
      page: page || 0,
      view: view || total,
      list: project.map((i) => new ProjectDto(i)),
    };
  }

  async findOne(id: string): Promise<ProjectDto> {
    const project = await this.project.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`NotFound ${id}`);

    return new ProjectDto(project);
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
