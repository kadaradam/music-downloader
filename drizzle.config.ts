import { defineConfig } from 'drizzle-kit';
import { config } from './src/config';

export default defineConfig({
  dbCredentials: {
    url: config.DB_URL,
  },
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
});
