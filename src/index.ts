import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { logger } from '@bogeychan/elysia-logger';
import ConvertVideoController from './controllers/ConvertVideoController';
import { config } from './config';
import { ProcessYouTubeConsumer } from './queue/consumers/ProcessYouTubeConsumer';

const port = config.PORT;
const app = new Elysia()
  .use(logger())
  .use(cors())
  .group('/api', (app) => app.use(ConvertVideoController))
  .ws('/ws/:fileId', {
    body: t.Null(),
    params: t.Object({
      fileId: t.String(),
    }),
    response: t.String(),
    open(ws) {
      const fileId = ws.data.params.fileId;

      ws.subscribe(fileId);
    },
    close(ws) {
      const fileId = ws.data.params.fileId;

      ws.unsubscribe(fileId);
    },
  })
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

ProcessYouTubeConsumer.listen(app);
