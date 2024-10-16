import { StatusCodes } from 'http-status-codes';
import { ApiError, ApiErrorType, ErrorResponse } from '../types/ApiError';

// TODO: Figure out TypeScript definition
export const errorHandler = ({ code, error, set }: any): ErrorResponse => {
  if (code === 'VALIDATION') {
    // Display the client how to fix the validation error
    return { type: ApiErrorType.VALIDATION_ERROR, message: error.all };
  }

  if (code === 'NOT_FOUND') {
    return { type: ApiErrorType.NOT_FOUND, message: 'Not Found' };
  }

  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    set.status = StatusCodes.BAD_REQUEST;

    return {
      type: ApiErrorType.SYNTAX_ERROR,
      message: 'Failed to process JSON.',
    };
  }

  if (error instanceof ApiError) {
    set.status = error.status;

    return { type: error.type, message: error.message };
  }

  set.status = StatusCodes.INTERNAL_SERVER_ERROR;

  return {
    type: ApiErrorType.UNEXPECTED_ERROR,
    message: 'Unexpected Error',
  };
};
