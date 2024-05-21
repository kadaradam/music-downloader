import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';
import { config } from '../config';

export const client = new Client({
  connectionString: config.DB_URL,
});

await client.connect();
export const db = drizzle(client, { schema });
