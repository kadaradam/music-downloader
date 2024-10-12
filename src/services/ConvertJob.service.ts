import { BunFile } from 'bun';
import { readFile, exists } from 'fs/promises';
import { eq, sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { db } from '../db/drizzle';
import { ConvertJobType, convertJobs } from '../db/schema';
import { sanitizeFileName } from '../libs/utils';

export abstract class ConvertJobService {
  static async getFile(
    fileId: string,
  ): Promise<{ title: string; file: BunFile }> {
    const fullOutputFilePath = `scripts/downloader/outputs/${fileId}.mp3`;

    console.log('Sending file', fullOutputFilePath);

    /*
      !!! Bun.file breaks with asyncronous drizzle queries !!!
    */

    //const file = Bun.file(fullOutputFilePath);
    //if (!(await file.exists())) {
    if (!(await exists(fullOutputFilePath))) {
      throw new Response('File not found', {
        status: StatusCodes.NOT_FOUND,
      });
    }

    const file = (await readFile(fullOutputFilePath)) as unknown as BunFile;
    const result = await db
      .update(convertJobs)
      .set({ downloadCount: sql`${convertJobs.downloadCount} + 1` })
      .where(eq(convertJobs.fileId, fileId))
      .returning({ title: convertJobs.title });

    const title = result[0].title;
    const cleanTitle = sanitizeFileName(title);

    return { title: cleanTitle, file };
  }

  static async findOne(fileId: string): Promise<ConvertJobType> {
    const result = await db
      .select()
      .from(convertJobs)
      .where(eq(convertJobs.fileId, fileId))
      .limit(1);

    if (!result.length) {
      throw new Response('Video info not found', {
        status: StatusCodes.NOT_FOUND,
      });
    }

    return result[0];
  }
}
