import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { IPaginationParams } from 'type';

import { UploadFilesEntity } from 'uploadFiles/uploadFiles.entity';

import { UserEntity } from 'user/user.entity';
import { PublicUserDto } from 'user/dto/PublicUser.dto';
import { AttachFilesEntity } from 'attachFiles/attachFiles.entity';
import { CreateAttachFilesDto } from 'attachFiles/dto/CreateAttachFiles.dto';
import { PublicAttachFilesDto } from 'attachFiles/dto/PublicAttachFiles.dto';

import { ProjectDto } from 'project/dto/Project.dto';
import { ProjectEntity } from 'project/project.entity';
import { CreateProjectDto } from 'project/dto/CreateProject.dto';

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
    private readonly upload: Repository<UploadFilesEntity>,

    @InjectRepository(AttachFilesEntity)
    private readonly attach: Repository<AttachFilesEntity>
  ) {}

  async create({ create, id }: { create: CreateProjectDto; id: string }) {
    const { name, attachFiles, ...res } = create;
    const isExist = await this.project.findOne({ where: { name }, select: { name: true } });
    const isUserExist = await this.user.findOne({ where: { id } });
    if (isExist) throw new BadRequestException(`Duplicate name, ${name}`);

    const newProject = this.project.create({ name, ...res, user: isUserExist });
    await newProject.save();

    const newattachFiles = await Promise.all(
      attachFiles.split(',').map(async (file: string) => {
        const attachFile = new CreateAttachFilesDto();
        attachFile.project = newProject;

        const uploadFile = await this.upload.findOne({ where: { path: file } });
        if (uploadFile) {
          attachFile.uploadFiles = [uploadFile];
        } else {
          // Handle the case when the upload file doesn't exist
          attachFile.uploadFiles = [];
        }

        return attachFile;
      })
    );

    const createdAttachFiles: AttachFilesEntity[] = this.attach.create(newattachFiles);
    await this.attach.save(createdAttachFiles);
    await this.project.update({ id: newProject.id }, { thumbnail: attachFiles.split(',')[0] });

    return {
      id: newProject.id,
      ...create,
      attachFiles: createdAttachFiles.map((item) => {
        return new PublicAttachFilesDto(item);
      }),
      user: new PublicUserDto(isUserExist),
    };
  }

  async findAll({ search, view, pageParam, id, orderBy }: IFindAll) {
    let findOption: FindManyOptions = { relations: ['user'] };
    if (search) findOption = { where: { name: Like(`%${search}%`) } };
    if (id) findOption = { ...findOption, where: { userId: id, isPublic: true } };
    if (orderBy) {
      if (orderBy === 'viewCount') findOption = { ...findOption, order: { viewCount: 'DESC' } };
      if (orderBy === 'thumbCount') findOption = { ...findOption, order: { thumbCount: 'DESC' } };
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
      list: project.map((i) => {
        return { ...i, user: new PublicUserDto(i.user) };
      }),
    };
  }

  async findOne(id: string) {
    const project = await this.project.findOne({
      where: { id },
      relations: ['user', 'attachFiles', 'attachFiles.uploadFiles'],
    });
    if (!project) throw new NotFoundException(`NotFound ${id}`);

    const { viewCount } = project;

    try {
      await this.project.update(id, { viewCount: viewCount + 1 });
    } catch (e) {
      return e;
    }

    return {
      ...project,
      attachFiles: project.attachFiles.map((attachFile) => attachFile.uploadFiles).flat(),
      user: new PublicUserDto(project.user),
    };
  }

  async update(id: string, update: Partial<CreateProjectDto>): Promise<Partial<ProjectDto>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, attachFiles, ...res } = update;
    if (name) {
      const isExist = await this.project.findOne({ where: { name }, select: { name: true } });
      if (isExist) throw new BadRequestException(`Duplicate Name ${name}`);
    }

    const project = await this.project.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`NotFound ${id}`);

    try {
      await this.project.update(id, { name, ...res });
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
