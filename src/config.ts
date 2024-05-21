import { t } from 'elysia';
import { Value } from '@sinclair/typebox/value';

const t_CastStringToNum = ({ default: _default }: { default: number }) =>
  t
    .Transform(t.String({ default: String(_default) }))
    .Decode((value) => parseInt(value))
    .Encode((value) => String(value));

const configType = t.Object(
  {
    PORT: t_CastStringToNum({ default: 3000 }),
    NODE_ENV: t.String({ default: 'development' }),
    DB_URL: t.String({
      default: 'postgres://postgres:password@localhost:5432/ytmp3',
    }),
    RABBIT_MQ_URL: t.String({ default: 'amqp://localhost' }),
    MAX_QUEUE_ITEMS: t_CastStringToNum({ default: 5 }),
  },
  { additionalProperties: false },
);

const parsedConfig = Value.Cast(configType, process.env);
const decodedConfig = Value.Decode(configType, parsedConfig);

export const config = decodedConfig;
