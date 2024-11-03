import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import {
  convertToDynamoSchema,
  convertToJavaScriptSchema,
  dbExpression,
  dbExpressionNames,
  dbExpressionValues,
} from '../libs/db.utils';
import { ItemProps, NumberItemProp, WithoutId } from '../types/db.type';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export abstract class DBService {
  static async insert<T>(tableName: string, props: WithoutId<T>): Promise<T> {
    const newItem = {
      ...props,
      id: crypto.randomUUID() as string,
    };

    await client.send(
      new PutItemCommand({
        TableName: tableName,
        Item: convertToDynamoSchema(newItem),
        ReturnValues: 'ALL_OLD',
      }),
    );

    return newItem as T;
  }

  static async updateOne<T>(
    tableName: string,
    lookupKeys: ItemProps<T>,
    props: ItemProps<T>,
  ): Promise<T> {
    const data = await client.send(
      new UpdateItemCommand({
        TableName: tableName,
        Key: convertToDynamoSchema(lookupKeys),
        UpdateExpression: dbExpression(props, { update: true }),
        ExpressionAttributeNames: dbExpressionNames(props),
        ExpressionAttributeValues: convertToDynamoSchema(props, {
          update: true,
        }),
        ReturnValues: 'ALL_NEW',
      }),
    );

    // Should not happen
    if (!data.Attributes) {
      throw new Error('Item not found');
    }

    return convertToJavaScriptSchema(data.Attributes) as T;
  }

  static async find<T>(
    tableName: string,
    lookupKeys: ItemProps<T>,
    {
      selectFields = undefined,
      primaryKey = undefined,
    }: {
      selectFields?: Array<keyof T>;
      primaryKey?: keyof T;
    } = {},
  ): Promise<T[]> {
    const queryParams: any = {
      TableName: tableName,
      ExpressionAttributeNames: dbExpressionNames(lookupKeys),
      ExpressionAttributeValues: dbExpressionValues(lookupKeys),
      ProjectionExpression: selectFields ? selectFields.join(', ') : undefined,
    };

    if (primaryKey) {
      const { [primaryKey]: primaryValue, ...lookupNoPrimaryKey } = lookupKeys;

      queryParams.KeyConditionExpression = dbExpression({
        [primaryKey]: primaryValue,
      });
      queryParams.FilterExpression = dbExpression(
        lookupNoPrimaryKey as ItemProps<T>,
      );
    } else {
      queryParams.KeyConditionExpression = dbExpression(lookupKeys);
    }

    const data = await client.send(new QueryCommand(queryParams));
    return data.Items as T[];
  }

  static async remove<T>(
    tableName: string,
    lookupKeys: ItemProps<T>,
  ): Promise<boolean> {
    await client.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: dbExpression(lookupKeys),
        ExpressionAttributeNames: dbExpressionNames(lookupKeys),
        ExpressionAttributeValues: dbExpressionValues(lookupKeys),
      }),
    );

    return true;
  }

  static async incrementOne<T>(
    tableName: string,
    lookupKeys: ItemProps<T>,
    prop: NumberItemProp<T>,
    value: number = 1,
  ): Promise<T> {
    const propName = prop as string;
    const data = await client.send(
      new UpdateItemCommand({
        TableName: tableName,
        Key: convertToDynamoSchema(lookupKeys),
        UpdateExpression: `SET #${propName} = ${propName} + :inc`,
        ExpressionAttributeNames: { [`#${propName}`]: propName },
        ExpressionAttributeValues: { ':inc': { N: value.toString() } },
        ReturnValues: 'ALL_NEW',
      }),
    );

    // Should not happen
    if (!data.Attributes) {
      throw new Error('Item not found');
    }

    return convertToJavaScriptSchema(data.Attributes) as T;
  }
}
