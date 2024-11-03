export enum ApiErrorType {
  // COMMON
  NOT_FOUND = 'not_found',
  VALIDATION_ERROR = 'validation_error',
  UNEXPECTED_ERROR = 'unexpected_error',
  SYNTAX_ERROR = 'syntax_error',
  BAD_REQUEST = 'bad_request',

  // CORS
  CORS_BLOCKED = 'cors_blocked',
}

export type ErrorResponse = {
  type: ApiErrorType;
  message: string;
};
