import {
  pgTable,
  serial,
  text,
  uniqueIndex,
  timestamp,
  pgEnum,
  integer,
} from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-typebox';
import { Static } from 'elysia';

export const typeEnum = pgEnum('convert_job_type', ['mp3']);
export const statusEnum = pgEnum('convert_job_status', [
  'pending',
  'completed',
  'failed',
]);

export const convertJobs = pgTable(
  'convert_jobs',
  {
    id: serial('id').primaryKey(),
    videoId: text('videoId').notNull(),
    fileId: text('file_id').notNull(),
    title: text('title').notNull(),
    type: typeEnum('type').notNull(),
    status: statusEnum('status').notNull().default('pending'),
    downloadCount: integer('download_count').default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    finishedAt: timestamp('finished_at'),
  },
  (jobs) => {
    return {
      nameIndex: uniqueIndex('file_id_idx').on(jobs.fileId),
    };
  },
);

export const selectConvertJobSchema = createSelectSchema(convertJobs);

export type ConvertJobType = Static<typeof selectConvertJobSchema>;
