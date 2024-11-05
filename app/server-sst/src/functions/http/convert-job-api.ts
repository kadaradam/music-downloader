import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { ApiError } from '../../libs/ApiError';
import { ApiGatewayRoute } from '../../libs/ApiGatewayHandler';
import { ApiResponse } from '../../libs/ApiResponse';
import { ConvertJobService } from '../../services/api/ConvertJob.service';
import { ApiErrorType } from '../../types/ApiError.type';

export const create = new ApiGatewayRoute()
  .validateBody(
    z.object({
      url: z.string(),
    }),
  )
  .handler(async (_, __, { body }) => {
    const url = body.url;

    const createdItem = await ConvertJobService.store(url);

    return new ApiResponse(createdItem);
  });

export const restore = new ApiGatewayRoute()
  .validateBody(
    z.object({
      fileId: z.string(),
    }),
  )
  .handler(async (_, __, { body }) => {
    const fileId = body.fileId;

    const restoredItem = await ConvertJobService.restore(fileId);

    return new ApiResponse(restoredItem);
  });

export const get = new ApiGatewayRoute().handler(async (event) => {
  const fileId = event.pathParameters?.fileId;

  if (!fileId) {
    throw new ApiError(
      ApiErrorType.BAD_REQUEST,
      StatusCodes.BAD_REQUEST,
      'Missing fileId',
    );
  }

  const item = await ConvertJobService.get(fileId);

  return new ApiResponse(item);
});

export const download = new ApiGatewayRoute().handler(async (event) => {
  const fileId = event.pathParameters?.fileId;

  if (!fileId) {
    throw new ApiError(
      ApiErrorType.BAD_REQUEST,
      StatusCodes.BAD_REQUEST,
      'Missing fileId',
    );
  }

  const downloadUrl = await ConvertJobService.download(fileId);

  return new ApiResponse({ url: downloadUrl }).setHeaders({
    Location: downloadUrl,
  });
});
