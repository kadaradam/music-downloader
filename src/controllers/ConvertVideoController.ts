import { Elysia, t } from 'elysia';
import { ConvertVideoService } from '../services/ConvertVideoService';

const ConvertVideoController = new Elysia({ prefix: '/convert-video' })
  .post(
    '/',
    async ({ body }) => {
      const { url } = body;

      try {
        const fileId = await ConvertVideoService.toMp3(url);

        return { fileId };
      } catch (err) {
        throw new Response('Failed to download the file', {
          status: 500,
        });
      }
    },
    {
      body: t.Object({
        url: t.String(),
      }),
      response: t.Object({
        fileId: t.String(),
      }),
    },
  )
  .get(
    '/:fileId',
    ({ params }) => {
      const { fileId } = params;

      const file = ConvertVideoService.getFile(fileId);

      return new Response(file, {
        headers: { 'Content-Type': 'audio/mpeg' },
      });
    },
    {
      params: t.Object({
        fileId: t.String(),
      }),
    },
  );

export default ConvertVideoController;
