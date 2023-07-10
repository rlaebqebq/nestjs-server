import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommonApiDocs } from 'common/common.docs';
import { Member } from 'auth/auth.decorator';
import { JWTAuthGuard } from 'auth/jwt.guard';
import { CommonResponse } from 'common/common.response';
import { CreateBookmarkDto } from 'bookmark/bookmark.dto';
import { CurrentUser } from 'auth/user.decorator';
import { UserEntity } from 'user/user.entity';

@ApiTags('bookmark')
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly service: BookmarkService) {}

  @ApiOperation(CommonApiDocs.CreateOperation())
  @ApiBody({
    type: CreateBookmarkDto,
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
  async create(@CurrentUser() { id }: UserEntity, @Body() createTeamDto: CreateBookmarkDto) {
    return await this.service.create({ id, createTeamDto });
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Delete(':projectId')
  @ApiOperation(CommonApiDocs.DeleteOperation())
  @ApiOkResponse(CommonResponse.OkResponse())
  @ApiUnauthorizedResponse(CommonResponse.UnauthorizedException())
  @ApiForbiddenResponse(CommonResponse.ForbiddenException())
  @ApiNotFoundResponse(CommonResponse.NotFoundException())
  @ApiBearerAuth('Access Token')
  @Member(true)
  @UseGuards(JWTAuthGuard)
  async remove(@CurrentUser() { id }: UserEntity, @Param('projectId', ParseUUIDPipe) projectId: string) {
    return await this.service.remove({ id, projectId });
  }
}
