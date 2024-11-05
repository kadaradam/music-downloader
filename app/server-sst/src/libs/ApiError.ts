import { APIGatewayProxyResultV2 } from 'aws-lambda';

import { ApiErrorType } from '../types/ApiError.type';

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

type ApiErrorResponseReturnType = (args: {
  status: number;
  message: Object | string;
  type: ApiErrorType;
}) => APIGatewayProxyResultV2;

export function ApiErrorResponse(error: Error): ApiErrorResponseReturnType {
  return ({ status, message, type }) => {
    return {
      statusCode: status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        type: type,
        ...(process.env.DEBUG && { stack: error.stack }), // Include stack trace in debug mode
      }),
    };
  };
}
