/// <reference path="./.sst/platform/config.d.ts" />
import { MEDIA_BUCKET_KEY_PREFIX } from './src/constants';

export default $config({
  app(input) {
    return {
      name: 'server-sst',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: { region: 'eu-central-1' },
      },
    };
  },
  async run() {
    const convertJobApi = new sst.aws.ApiGatewayV2('ConvertJobApi', {
      /*  cors: {
        allowMethods: ["GET", "POST"],
        allowOrigins: ["http://localhost:30001"],
      }, */
    });
    const convertJobQueue = new sst.aws.Queue(
      'ConvertJobQueue',
      /* { fifo: true }, */
    );
    const convertJobsTable = new sst.aws.Dynamo('ConvertJobsTable', {
      fields: {
        fileId: 'string',
      },
      primaryIndex: { hashKey: 'fileId' },
    });

    const mediaBucket = new sst.aws.Bucket('MediaBucket', {
      access: 'public',
      cors: {
        allowHeaders: ['*'],
        allowOrigins: ['*'],
        allowMethods: ['GET'],
      },
    });

    // Delete audio assets after 1 day
    new aws.s3.BucketLifecycleConfigurationV2('expireMediaObjects', {
      bucket: mediaBucket.name,
      rules: [
        {
          id: 'ExpireAfterOneDay',
          status: 'Enabled',
          expiration: { days: 1 },
          filter: { prefix: MEDIA_BUCKET_KEY_PREFIX },
        },
      ],
    });

    mediaBucket.subscribe(
      {
        handler: 'src/functions/s3/media-expiration-subscriber.handler',
        link: [convertJobsTable],
      },
      {
        filterPrefix: MEDIA_BUCKET_KEY_PREFIX,
        events: ['s3:ObjectRemoved:*', 's3:LifecycleExpiration:*'],
      },
    );

    convertJobApi.route('POST /api/convert/youtube', {
      link: [convertJobsTable, convertJobQueue],
      handler: 'src/functions/http/convert-job-api.create',
    });
    convertJobApi.route('POST /api/convert/youtube/restore', {
      link: [convertJobsTable, convertJobQueue],
      handler: 'src/functions/http/convert-job-api.restore',
    });
    convertJobApi.route('GET /api/convert/{fileId}', {
      link: [convertJobsTable],
      handler: 'src/functions/http/convert-job-api.get',
    });
    convertJobApi.route('GET /api/convert/{fileId}/download', {
      link: [mediaBucket, convertJobsTable],
      handler: 'src/functions/http/convert-job-api.download',
    });

    convertJobQueue.subscribe({
      handler: 'src/functions/queue/py/convert-queue-subscriber.handler',
      link: [convertJobsTable, mediaBucket],
      memory: '128 MB',
      runtime: 'python3.9',
      layers: ['arn:aws:lambda:eu-central-1:722103386131:layer:ffmpeg:1'],
      environment: {
        MEDIA_BUCKET_NAME: mediaBucket.name,
        MEDIA_BUCKET_KEY_PREFIX,
        CONVERT_JOB_TABLE_NAME: convertJobsTable.name,
      },
    });

    return {
      apiUrl: convertJobApi.url,
    };
  },
});
