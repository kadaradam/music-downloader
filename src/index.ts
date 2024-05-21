import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { config } from './config';
import { ProcessYouTubeConsumer } from './queue/consumers/ProcessYouTubeConsumer';

const port = config.PORT;
const app = new Elysia().use(cors()).listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

ProcessYouTubeConsumer.listen();
