import { Resource } from 'sst';

import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';

const client = new ApiGatewayManagementApiClient({
  endpoint: Resource.CompletedJobWebSocket.managementEndpoint,
});

export abstract class WebsocketPublisherService {
  static async postMessage(connectionId: string, message: string) {
    return client.send(
      new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: message,
      }),
    );
  }
}
