import { cron } from '@elysiajs/cron';
import { Elysia } from 'elysia';
import { unlink } from 'fs/promises';
import { db } from '../db/drizzle';
import { convertJobs } from '../db/schema';
import { and, eq, lt } from 'drizzle-orm';
import { getFilePath } from '../libs/utils';

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

export const StorageCleanUpCron = new Elysia().use(
  cron({
    name: 'free-up-storage',
    pattern: '0 * * * *', // “At minute 0.”
    async run() {
      const oneDayAgo = new Date(Date.now() - ONE_DAY_IN_MS);

      const outdatedJobs = await db
        .delete(convertJobs)
        .where(
          and(
            eq(convertJobs.status, 'completed'),
            lt(convertJobs.finishedAt, oneDayAgo),
          ),
        )
        .returning({ id: convertJobs.id, fileId: convertJobs.fileId });

      const cleanupPromises = outdatedJobs.map((job) =>
        clearOutdatedFile(job.fileId),
      );
      await Promise.all(cleanupPromises);
    },
  }),
);

async function clearOutdatedFile(fileId: string): Promise<void> {
  const fileToRemove = getFilePath(fileId);

  try {
    await db.transaction(async (tx) => {
      console.log('Cleaning up the file', fileToRemove);

      await unlink(fileToRemove);
      await tx.delete(convertJobs).where(eq(convertJobs.fileId, fileId));

      console.log(`cron: File ${fileToRemove} removed`);
    });
  } catch (err) {
    console.error('Failed to free up storage. Reverting DB...', err);
  }
}
