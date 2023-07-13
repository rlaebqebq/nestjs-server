import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
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

import { CommonResponse } from 'common/common.response';
import { CommonApiDocs } from 'common/common.docs';
import { AuthService } from 'auth/auth.service';
import { CurrentUser } from 'auth/user.decorator';
import { AuthDto } from 'auth/auth.dto';
import { JWTAuthGuard } from 'auth/jwt.guard';
import { Member } from 'auth/auth.decorator';

import { UserEntity } from 'user/user.entity';
import { UserApiDocs } from 'user/user.docs';
import { UserService } from 'user/user.service';
import { JoinUserDto } from 'user/dto/JoinUser.dto';
import { UpdateUserDto } from 'user/dto/UpdateUser.dto';
import { PublicUserDto } from 'user/dto/PublicUser.dto';
import { UserDto } from 'user/dto/User.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService, private readonly authService: AuthService) {}

  @Post('join')
  @ApiOperation(UserApiDocs.JoinOperation())
  @ApiCreatedResponse(CommonResponse.CreatedResponse())
  @ApiBadRequestResponse(CommonResponse.BadRequestException())
  join(@Body() joinUserDto: JoinUserDto): Promise<PublicUserDto> {
    return this.service.join(joinUserDto);
  }

  @Post('login')
  @ApiOperation(UserApiDocs.LoginOperation())
  @ApiOkResponse(UserApiDocs.LoginOkRes())
  @ApiNotFoundResponse(CommonResponse.NotFoundException())
  login(@Body() loginDto: AuthDto) {
    return this.authService.jwtLogin(loginDto);
  }

  @Patch()
  @ApiOperation(CommonApiDocs.EditOperation())
  @ApiBody({
    type: UpdateUserDto,
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
  update(@CurrentUser() { id }: UserEntity, @Body() update: UpdateUserDto): Promise<Partial<UpdateUserDto>> {
    return this.service.update(id, update);
  }

  @ApiOperation(UserApiDocs.RetrieveOperation())
  @ApiOkResponse(UserApiDocs.RetrieveOkRes())
  @ApiUnauthorizedResponse(CommonResponse.UnauthorizedException())
  @ApiBearerAuth('Access Token')
  @UseGuards(JWTAuthGuard)
  @Get()
  findOne(@CurrentUser() { id }: UserEntity): Promise<UserDto> {
    return this.service.findOne(id);
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
  async remove(@CurrentUser() { id }: UserEntity) {
    return await this.service.remove(id);
  }
}
