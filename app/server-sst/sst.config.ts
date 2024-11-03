/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "server-sst",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { region: "eu-central-1" },
      },
    };
  },
  async run() {
    const convertJobApi = new sst.aws.ApiGatewayV2("ConvertJobApi", {
      /*  cors: {
        allowMethods: ["GET", "POST"],
        allowOrigins: ["http://localhost:30001"],
      }, */
    });
    const convertJobQueue = new sst.aws.Queue(
      "ConvertJobQueue"
      /* { fifo: true }, */
    );
    const convertJobsTable = new sst.aws.Dynamo("ConvertJobsTable", {
      fields: {
        fileId: "string",
      },
      primaryIndex: { hashKey: "fileId" },
    });
    const mediaBucket = new sst.aws.Bucket("MediaBucket", {
      access: "public",
      cors: {
        allowMethods: ["GET"],
      },
    });

    convertJobApi.route("POST /api/convert/youtube", {
      link: [convertJobsTable, convertJobQueue],
      handler: "src/functions/http/convert-job-api.create",
    });
    convertJobApi.route("POST /api/convert/youtube/restore", {
      link: [convertJobsTable, convertJobQueue],
      handler: "src/functions/http/convert-job-api.restore",
    });
    convertJobApi.route("GET /api/convert/{fileId}", {
      link: [convertJobsTable],
      handler: "src/functions/http/convert-job-api.get",
    });
    convertJobApi.route("GET /api/convert/{fileId}/download", {
      link: [mediaBucket, convertJobsTable],
      handler: "src/functions/http/convert-job-api.download",
    });

    convertJobQueue.subscribe({
      handler: "src/functions/queue/py/convert-queue-subscriber.handler",
      link: [convertJobsTable, mediaBucket],
      memory: "512 MB",
      runtime: "python3.9",
    });

    return {
      apiUrl: convertJobApi.url,
    };
  },
});
