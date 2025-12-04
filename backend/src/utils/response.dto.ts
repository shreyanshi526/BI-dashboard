/**
 * Create a standardized response DTO
 */
export function createResponseDto<T>(
  statusCode: number,
  status: string,
  message: string,
  data: T | null
): object {
  return {
    statusCode: statusCode,
    status: status,
    message: message,
    data: data,
  };
}

/**
 * Success response helper
 */
export function successResponse<T>(
  message: string,
  data: T | null = null,
  statusCode: number = 200
): object {
  return createResponseDto(statusCode, 'success', message, data);
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  data: any = null
): object {
  return createResponseDto(statusCode, 'error', message, data);
}

