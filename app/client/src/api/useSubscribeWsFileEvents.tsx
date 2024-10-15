import { ConvertJob } from '@/types/ConvertJob';
import { useEffect, useRef } from 'react';

const WS_API_URL = process.env.NEXT_PUBLIC_WS_API_URL || 'ws://localhost:3000';

type useSubscribeWsFileEventsProps = {
  fileId: string | undefined;
  enabled: boolean;
  onMessage: (event: ConvertJob) => void;
};

export function useSubscribeWsFileEvents({
  fileId,
  enabled,
  onMessage,
}: useSubscribeWsFileEventsProps) {
  const connection = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!fileId || !enabled) {
      return;
    }

    const socket = new WebSocket(`${WS_API_URL}/ws/get/${fileId}`);

    // Connection opened
    socket.addEventListener('open', () => {
      socket.send('Connection established');
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
      console.log('Message from server ', event.data);
      try {
        const parsedData = JSON.parse(event.data);
        onMessage(parsedData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.error(`Error parsing message: ${event.data}`);
      }
    });

    connection.current = socket;

    return () => connection.current?.close();
  }, [enabled, fileId, onMessage]);

  return { close: () => connection.current?.close() };
}
