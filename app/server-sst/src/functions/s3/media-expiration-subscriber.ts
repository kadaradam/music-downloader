import { Resource } from 'sst';

import { S3Event } from 'aws-lambda';

import { MEDIA_BUCKET_KEY_PREFIX } from '../../constants';
import { DBService } from '../../services/db.service';
import { ConvertJob, ConvertJobStatusEnum } from '../../types/ConvertJob.type';

export async function handler(event: S3Event): Promise<string> {
  try {
    for (const record of event.Records) {
      const key = record.s3.object.key;

      await archiveCovertJob(key);
    }
  } catch (error) {
    console.error(`Error processing S3 event: ${error}`);
  }
  return 'ok';
}

async function archiveCovertJob(objectKey: string): Promise<boolean> {
  try {
    const fileId = objectKey.replace(`${MEDIA_BUCKET_KEY_PREFIX}/`, '');

    console.log(`Setting file to archived: ${objectKey}`);

    await DBService.updateOne<ConvertJob>(
      Resource.ConvertJobsTable.name,
      { fileId },
      { status: ConvertJobStatusEnum.ARCHIVED },
    );

    return true;
  } catch (error) {
    console.error(`Error archiving job: ${error}`);
    return false;
  }
}
