import { APIGatewayEvent, APIGatewayProxyResultV2, Context } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { ApiError, ApiErrorResponse } from "./ApiError";
import { ApiErrorType } from "../types/ApiError.type";
import { z, ZodError } from "zod";
import { ApiResponse } from "./ApiResponse";

type Handler = (
  event: APIGatewayEvent,
  context: Context,
  validatedData: {
    body: Record<string, any>;
  }
) =>
  | APIGatewayProxyResultV2
  | Promise<APIGatewayProxyResultV2>
  | ApiResponse
  | Promise<ApiResponse>;

export class ApiGatewayRoute {
  private bodyValidator: z.ZodObject<any, any> | null = null;

  useBodyValidator(validator: z.ZodObject<any, any>) {
    this.bodyValidator = validator;
    return this;
  }

  handler(handlerFunc: Handler) {
    return async (
      event: APIGatewayEvent,
      context: Context
    ): Promise<APIGatewayProxyResultV2> => {
      try {
        let body = {};

        // Validate the body if a validator is registered
        if (this.bodyValidator !== null && event.body) {
          const eventBody = JSON.parse(event.body);
          body = this.bodyValidator.parse(eventBody);
        }

        // Call the original handler
        return (await handlerFunc(event, context, {
          body,
        })) as APIGatewayProxyResultV2;
      } catch (error) {
        console.error("Error in handler:", error);

        if (error instanceof SyntaxError && error.message.includes("JSON")) {
          return ApiErrorResponse(error)({
            status: StatusCodes.BAD_REQUEST,
            message: "Failed to process JSON.",
            type: ApiErrorType.SYNTAX_ERROR,
          });
        }

        if (error instanceof ZodError) {
          return ApiErrorResponse(error)({
            status: StatusCodes.BAD_REQUEST,
            message: {
              error: "Validation error",
              details: error.errors,
            },
            type: ApiErrorType.SYNTAX_ERROR,
          });
        }

        if (error instanceof ApiError) {
          const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
          const type = error.type || ApiErrorType.UNEXPECTED_ERROR;
          const message = error.message || "An internal server error occurred";

          return ApiErrorResponse(error)({
            status,
            message,
            type,
          });
        }

        return ApiErrorResponse(error as Error)({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "An internal server error occurred",
          type: ApiErrorType.UNEXPECTED_ERROR,
        });
      }
    };
  }
}
