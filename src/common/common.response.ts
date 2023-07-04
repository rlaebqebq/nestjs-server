import { exceptionFormatter, responseFormatter } from './response-formatter.utils';

export class CommonResponse {
  // 200
  static OkResponse() {
    return {
      description: 'Ok',
      // type: responseFormatter({}),
    };
  }

  static FindAllOkResponse() {
    return {
      description: 'Ok',
      isArray: true,
    };
  }

  static FindOneOkResponse() {
    return {
      description: 'Ok',
    };
  }

  // 201
  static CreatedResponse() {
    return {
      // description: 'Created',
      type: responseFormatter({}),
    };
  }

  // 204
  static NoContentResponse() {
    return {
      description: 'No Content',
    };
  }

  // 400
  static BadRequestException() {
    return {
      description: 'Bad Request',
      type: exceptionFormatter(String, true),
    };
  }

  // 401
  static UnauthorizedException() {
    return {
      description: 'Unauthorized',
      type: exceptionFormatter({}),
    };
  }

  // 403
  static ForbiddenException() {
    return {
      description: 'Forbidden',
      type: exceptionFormatter({}),
    };
  }

  // 404
  static NotFoundException() {
    return {
      description: 'Not Found',
      type: exceptionFormatter({}),
    };
  }

  // 409
  static ConflictException() {
    return {
      description: 'Conflict',
      type: exceptionFormatter({}),
    };
  }
}
