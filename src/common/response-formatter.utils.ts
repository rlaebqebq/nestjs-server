import { ApiProperty } from '@nestjs/swagger';

class BaseResponse {
  @ApiProperty({})
  success: boolean;

  @ApiProperty({})
  timestamp: Date;

  @ApiProperty({})
  message: string;
}

class BaseException {
  @ApiProperty({
    example: false,
  })
  success: boolean;

  @ApiProperty({})
  timestamp: Date;

  @ApiProperty({})
  message: string;
}

export function responseFormatter(dto: object, isArray = false) {
  class ResponseOne extends BaseResponse {
    @ApiProperty({
      type: dto,
    })
    data: object;
  }

  class ResponseList extends BaseResponse {
    @ApiProperty({
      type: dto,
      isArray: true,
    })
    data: object;
  }

  return !isArray ? ResponseOne : ResponseList;
}

export function exceptionFormatter(type: object, isArray = false) {
  class ExceptionOne extends BaseException {
    @ApiProperty({
      type,
    })
    data: any;
  }

  class ExceptionList extends BaseException {
    @ApiProperty({
      type,
      isArray: true,
    })
    data: any;
  }

  return !isArray ? ExceptionOne : ExceptionList;
}
