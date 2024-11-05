import { Resource } from 'sst';

import { APIGatewayEvent } from 'aws-lambda';

import { DBService } from '../../services/db.service';
import { WsConnection } from '../../types/WsConnection.type';

export async function connect(event: APIGatewayEvent) {
  const fileId = event.queryStringParameters?.fileId;
  const connectionId = event.requestContext.connectionId;

  if (!fileId || !connectionId) {
    return {
      statusCode: 400,
      body: 'fileId is required',
    };
  }

  await DBService.insert<WsConnection>(
    Resource.WsConnectionsTable.name,
    {
      connectionId,
      fileId,
      createdAt: new Date().toISOString(),
    },
    { skipAutoId: true },
  );

  console.log('Client connected', { fileId, connectionId });

  return { statusCode: 200 };
}

export async function disconnect(event: APIGatewayEvent) {
  const connectionId = event.requestContext.connectionId;

  if (!connectionId) {
    return {
      statusCode: 400,
      body: 'connectionId is required',
    };
  }

  await DBService.remove<WsConnection>(Resource.WsConnectionsTable.name, {
    connectionId,
  });

  console.log('Client disconnected', { connectionId });

  return { statusCode: 200 };
}
