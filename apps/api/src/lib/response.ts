export function successResponse<T>(data: T, message = "Berhasil", path = "/api") {
  return {
    path,
    status: "success",
    message,
    data,
  };
}

export function paginationResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  path = "/api",
  message = "Berhasil"
) {
  return {
    success: true,
    message,
    data,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    path,
  };
}

export function errorResponse(message: string, error?: string) {
  return {
    success: false,
    message,
    error,
    data: null,
  };
}

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};
