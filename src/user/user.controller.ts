import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
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

import { UserEntity } from './user.entity';
import { UserApiDocs } from './user.docs';
import { GetUserDto, JoinUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Post('join')
  @ApiOperation(UserApiDocs.JoinOperation())
  @ApiCreatedResponse(CommonResponse.CreatedResponse())
  @ApiBadRequestResponse(CommonResponse.BadRequestException())
  join(@Body() joinUserDto: JoinUserDto): Promise<void> {
    return this.userService.join(joinUserDto);
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
  async update(@CurrentUser() { id }: UserEntity, @Body() update: UpdateUserDto) {
    return this.userService.update(id, update);
  }

  @ApiOperation(UserApiDocs.RetrieveOperation())
  @ApiOkResponse(UserApiDocs.RetrieveOkRes())
  @ApiUnauthorizedResponse(CommonResponse.UnauthorizedException())
  @ApiBearerAuth('Access Token')
  @UseGuards(JWTAuthGuard)
  @Get()
  retrieve(@CurrentUser() user: UserEntity): GetUserDto {
    return new GetUserDto(user);
  }
}
