import { ApiResponse } from '../interfaces/api-response.interface';
import { ApiCode } from '../constants/api-code.constant';

export class ApiResponseUtil {
  static success<T>(data: T, message = 'Operation successful'): ApiResponse<T> {
    return {
      message,
      code: ApiCode.SUCCESS,
      data,
    };
  }

  static error(
    message = 'Operation failed',
    code = ApiCode.INTERNAL_ERROR,
  ): ApiResponse<null> {
    return {
      message,
      code,
      data: null,
    };
  }

  static notFound(message = 'Resource not found'): ApiResponse<null> {
    return {
      message,
      code: ApiCode.NOT_FOUND,
      data: null,
    };
  }
}
