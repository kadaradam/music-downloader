export enum ApiErrorType {
  // COMMON
  NOT_FOUND = 'not_found',
  VALIDATION_ERROR = 'validation_error',
  UNEXPECTED_ERROR = 'unexpected_error',
  SYNTAX_ERROR = 'syntax_error',

  // CORS
  CORS_BLOCKED = 'cors_blocked',
}

export class ApiError extends Error {
  type: ApiErrorType;
  status: number;
  message: string;

  constructor(type: ApiErrorType, status: number, message: string) {
    super(type);
    this.type = type;
    this.message = message;
    this.status = status;
  }
}

export type ErrorResponse = {
  type: ApiErrorType;
  message: string;
};
