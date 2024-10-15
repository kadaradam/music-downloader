import { Elysia, t } from 'elysia';
import { YouTubeConvertService } from '../services/YouTubeConvert.service';
import { ConvertJobService } from '../services/ConvertJob.service';
import { selectConvertJobSchema } from '../db/schema';

const ConvertVideoController = new Elysia({ prefix: '/convert' })
  .post(
    '/youtube',
    async ({ body }) => {
      const { url } = body;

      const convertJob = await YouTubeConvertService.toMp3(url);

      return convertJob;
    },
    {
      body: t.Object({
        url: t.String(),
      }),
      response: selectConvertJobSchema,
    },
  )
  .post(
    '/youtube/restore',
    async ({ body }) => {
      const { fileId } = body;

      const convertJob = await YouTubeConvertService.restoreMp3(fileId);

      return convertJob;
    },
    {
      body: t.Object({
        fileId: t.String(),
      }),
      response: selectConvertJobSchema,
    },
  )
  .get(
    '/:fileId/download',
    async ({ params }) => {
      const { fileId } = params;

      const { title, file } = await ConvertJobService.getFile(fileId);

      return new Response(file, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${title}.mp3"`,
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    },
    {
      params: t.Object({
        fileId: t.String(),
      }),
    },
  )
  .get(
    '/:fileId',
    async ({ params }) => {
      const { fileId } = params;

      const convertJob = await ConvertJobService.findOne(fileId);

      return convertJob;
    },
    {
      params: t.Object({
        fileId: t.String(),
      }),
      response: selectConvertJobSchema,
    },
  );

export default ConvertVideoController;
