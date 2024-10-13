import { Elysia, t } from 'elysia';

export const NotifyJobCompletedWS = new Elysia().ws('/ws/get/:fileId', {
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
});
