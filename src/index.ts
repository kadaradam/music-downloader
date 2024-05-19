import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

const port = process.env.PORT || 3000;
const app = new Elysia().use(cors()).listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
