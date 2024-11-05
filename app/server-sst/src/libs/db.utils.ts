import { AttributeValue } from '@aws-sdk/client-dynamodb';

import { ItemProps } from '../types/db.type';

export function convertToDynamoSchema<T>(
  props: ItemProps<T>,
  { update }: { update: boolean } = { update: false },
): Record<string, AttributeValue> {
  return Object.entries(props).reduce(
    (acc, [key, value]) => {
      acc[update ? `:${key}` : key] =
        typeof value === 'string'
          ? { S: value }
          : typeof value === 'boolean'
            ? { BOOL: value }
            : { N: (value as number).toString() };
      return acc;
    },
    {} as Record<string, AttributeValue>,
  );
}

export function convertToJavaScriptSchema(
  dynamoObject: Record<string, AttributeValue>,
): Record<string, any> {
  const obj: Record<string, any> = {};

  Object.entries(dynamoObject).forEach(([key, value]) => {
    if ('N' in value) {
      obj[key] = Number(value.N);
    } else if ('S' in value) {
      obj[key] = value.S;
    } else if ('BOOL' in value) {
      obj[key] = value.BOOL;
    }
  });

  return obj;
}

export function dbExpression<T>(
  props: ItemProps<T>,
  { update }: { update: boolean } = { update: false },
): string {
  const expression = Object.keys(props)
    .map((key) => `#${key} = :${key}`)
    .join(update ? ', ' : ' AND ');

  return update ? `SET ${expression}` : expression;
}

export function dbExpressionValues<T>(
  props: ItemProps<T>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [`:${key}`, value]),
  );
}

export function dbExpressionNames<T>(
  props: ItemProps<T>,
): Record<string, string> {
  return Object.fromEntries(Object.keys(props).map((key) => [`#${key}`, key]));
}
