import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CommonResponse } from 'common/common.response';
import { CommonApiDocs } from 'common/common.docs';
import { Member } from 'auth/auth.decorator';
import { JWTAuthGuard } from 'auth/jwt.guard';
import { CurrentUser } from 'auth/user.decorator';
import { UserEntity } from 'user/user.entity';

import { ProjectService } from './project.service';
import { ProjectDto } from 'project/dto/Project.dto';
import { ProjectEntity } from './project.entity';
import { CreateProjectDto } from 'project/dto/CreateProject.dto';
import { UpdateProjectDto } from 'project/dto/UpdateProject.dto';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @ApiOperation(CommonApiDocs.CreateOperation())
  @ApiBody({
    type: CreateProjectDto,
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBearerAuth('Access Token')
  @Member(true)
  @UseGuards(JWTAuthGuard)
  @ApiUnauthorizedResponse(CommonResponse.UnauthorizedException())
  @ApiForbiddenResponse(CommonResponse.ForbiddenException())
  @ApiCreatedResponse(CommonResponse.CreatedResponse())
  @ApiBadRequestResponse(CommonResponse.BadRequestException())
  @Post()
  async create(@CurrentUser() { id }: UserEntity, @Body() create: CreateProjectDto) {
    // console.log(create);
    return this.service.create({ create, id });
  }

  @Get()
  @ApiOperation(CommonApiDocs.FindAllOperation())
  @ApiOkResponse({ ...CommonResponse.FindAllOkResponse(), type: ProjectEntity })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'view', type: Number, required: false })
  @ApiQuery({ name: 'pageParam', type: Number, required: false })
  @ApiQuery({ name: 'orderBy', type: String, required: false })
  async findAll(
    @Query('search') search?: string,
    @Query('view') view?: number,
    @Query('pageParam') pageParam?: number,
    @Query('orderBy') orderBy?: string
  ) {
    return await this.service.findAll({ search, view, pageParam, orderBy });
  }

  @Get(':id')
  @ApiOperation(CommonApiDocs.FindOneOperation())
  @ApiOkResponse({ ...CommonResponse.FindOneOkResponse(), type: ProjectDto })
  @ApiNotFoundResponse(CommonResponse.NotFoundException())
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation(CommonApiDocs.EditOperation())
  @ApiBody({
    type: UpdateProjectDto,
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBearerAuth('Access Token')
  @Member(true)
  @UseGuards(JWTAuthGuard)
  @ApiUnauthorizedResponse(CommonResponse.UnauthorizedException())
  @ApiForbiddenResponse(CommonResponse.ForbiddenException())
  @ApiOkResponse(CommonResponse.OkResponse())
  @ApiBadRequestResponse(CommonResponse.BadRequestException())
  @ApiNotFoundResponse(CommonResponse.NotFoundException())
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() update: UpdateProjectDto) {
    return await this.service.update(id, update);
  }

  @Delete(':id')
  @ApiOperation(CommonApiDocs.DeleteOperation())
  @ApiOkResponse(CommonResponse.OkResponse())
  @ApiUnauthorizedResponse(CommonResponse.UnauthorizedException())
  @ApiForbiddenResponse(CommonResponse.ForbiddenException())
  @ApiNotFoundResponse(CommonResponse.NotFoundException())
  @ApiBearerAuth('Access Token')
  @Member(true)
  @UseGuards(JWTAuthGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.service.remove(id);
  }
}
