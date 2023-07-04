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
import { CreateProjectDto, ProjectDto, ProjectListDto, UpdateProjectDto } from './project.dto';

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
    return this.service.create({ create, id });
  }

  @Get()
  @ApiOperation(CommonApiDocs.FindAllOperation())
  @ApiOkResponse({ ...CommonResponse.FindAllOkResponse(), type: ProjectListDto })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'view', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  async findAll(@Query('search') search?: string, @Query('view') view?: number, @Query('page') page?: number) {
    return await this.service.findAll({ search, view, page });
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
