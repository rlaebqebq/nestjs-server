import { Controller, Get, Param, Post, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';

import { CommonApiDocs } from 'common/common.docs';
import { CommonResponse } from 'common/common.response';
import { multerDiskDestinationOutOptions } from 'common/multer.options';
import { Member } from 'auth/auth.decorator';
import { JWTAuthGuard } from 'auth/jwt.guard';
import { CurrentUser } from 'auth/user.decorator';
import { UserEntity } from 'user/user.entity';

import { UploadFilesService } from 'uploadFiles/uploadFiles.service';
import { UploadFilesDto } from 'uploadFiles/dto/uploadFiles.dto';
import { FindUploadDto } from 'uploadFiles/dto/FindUpload.dto';

@ApiTags('uploadFiles')
@Controller('uploadFiles')
export class UploadFilesController {
  constructor(private readonly service: UploadFilesService) {}

  @Post()
  @ApiOperation(CommonApiDocs.CreateOperation())
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', null, multerDiskDestinationOutOptions))
  @ApiBody({
    type: UploadFilesDto,
  })
  @ApiBearerAuth('Access Token')
  @Member(true)
  @UseGuards(JWTAuthGuard)
  @ApiUnauthorizedResponse(CommonResponse.UnauthorizedException())
  @ApiForbiddenResponse(CommonResponse.ForbiddenException())
  @ApiCreatedResponse(CommonResponse.CreatedResponse())
  @ApiBadRequestResponse(CommonResponse.BadRequestException())
  async create(@CurrentUser() { id }: UserEntity, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.service.create({ files, id });
  }

  @Get()
  @ApiOperation(CommonApiDocs.FindAllOperation())
  @ApiOkResponse({ ...CommonResponse.FindAllOkResponse(), type: FindUploadDto })
  @ApiNotFoundResponse(CommonResponse.NotFoundException())
  @ApiBearerAuth('Access Token')
  @Member(true)
  @UseGuards(JWTAuthGuard)
  @ApiUnauthorizedResponse(CommonResponse.UnauthorizedException())
  @ApiForbiddenResponse(CommonResponse.ForbiddenException())
  async findAll(@CurrentUser() { id }: UserEntity) {
    return await this.service.findAll(id);
  }

  @Get(':path')
  @ApiOperation(CommonApiDocs.FindFileOneOperation())
  @ApiOkResponse({ ...CommonResponse.FindOneOkResponse(), type: UploadFilesDto })
  @ApiNotFoundResponse(CommonResponse.NotFoundException())
  async findOne(@Res() res: Response, @Param('path') path: string) {
    res.sendFile(join(process.cwd(), path));
  }
}
