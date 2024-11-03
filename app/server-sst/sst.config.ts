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
    convertJobApi.route("POST /api/convert/youtube", {
      handler: "src/functions/http/convert-job-api.create",
    });
    convertJobApi.route("POST /api/convert/youtube/restore", {
      handler: "src/functions/http/convert-job-api.restore",
    });
    convertJobApi.route("GET /api/convert/{fileId}", {
      handler: "src/functions/http/convert-job-api.get",
    });
    convertJobApi.route("GET /api/convert/{fileId}/download", {
      handler: "src/functions/http/convert-job-api.download",
    });

    return {
      apiUrl: convertJobApi.url,
    };
  },
});
