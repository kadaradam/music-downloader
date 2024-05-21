import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import ConvertVideoController from './controllers/ConvertVideoController';
import { config } from './config';
import { ProcessYouTubeConsumer } from './queue/consumers/ProcessYouTubeConsumer';

const port = config.PORT;
const app = new Elysia()
  .use(cors())
  .group('/api', (app) => app.use(ConvertVideoController))
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

ProcessYouTubeConsumer.listen();
