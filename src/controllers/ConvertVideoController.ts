import { Elysia, t } from 'elysia';
import { ConvertVideoService } from '../services/ConvertVideoService';
import { selectConvertJobSchema } from '../db/schema';

const ConvertVideoController = new Elysia({ prefix: '/convert-video' })
  .post(
    '/',
    async ({ body }) => {
      const { url } = body;

      const convertJob = await ConvertVideoService.toMp3(url);

      return convertJob;
    },
    {
      body: t.Object({
        url: t.String(),
      }),
      response: selectConvertJobSchema,
    },
  )
  .get(
    '/:fileId/download',
    async ({ params }) => {
      const { fileId } = params;

      const { title, file } = await ConvertVideoService.getFile(fileId);

      return new Response(file, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${title}.mp3"`,
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

      const convertJob = await ConvertVideoService.findOne(fileId);

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
