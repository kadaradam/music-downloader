import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { logger } from '@bogeychan/elysia-logger';
import ConvertVideoController from './controllers/ConvertVideoController';
import { config } from './config';
import { ProcessYouTubeConsumer } from './queue/consumers/ProcessYouTube.consumer';
import { errorHandler } from './middlewares/ErrorHandler';
import { StorageCleanUpCron } from './crons/StorageCleanUp.cron';
import { NotifyJobCompletedWS } from './websockets/NotifyJobCompleted.websocket';

const port = config.PORT;
const app = new Elysia()
  .onError(errorHandler)
  .use(logger())
  .use(cors())
  .group('/api', (app) => app.use(ConvertVideoController))
  .use(StorageCleanUpCron)
  .use(NotifyJobCompletedWS)
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

ProcessYouTubeConsumer.listen(app);

export type AppType = typeof app;
