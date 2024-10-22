import Image from 'next/image';
import { getYtVideoThumbnail } from '@/lib/utils';
import { ConvertJob } from '@/types/ConvertJob';
import { useEffect, useRef, useState } from 'react';
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons';

export default function PlayableThumbnail({ item }: { item: ConvertJob }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isCompleted = item.status === 'completed';

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }

    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      const handlePause = () => setIsPlaying(false);
      const handlePlay = () => setIsPlaying(true);

      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('play', handlePlay);

      return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('play', handlePlay);
      };
    }
  }, [audioRef]);

  return (
    <div
      className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat rounded-lg border border-gray-200"
      data-twe-ripple-init
      data-twe-ripple-color="light"
    >
      <Image
        src={getYtVideoThumbnail(item.videoId)}
        width={100}
        height={100}
        alt="Thumbnail"
      />
      {isCompleted ? (
        <div
          onClick={togglePlay}
          className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-background hover:opacity-90 bg-fixed opacity-0 transition duration-300 ease-in-out flex items-center justify-center"
        >
          <audio controls className="hidden" ref={audioRef}>
            <source
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/convert/${item.fileId}/download`}
              type="audio/mpeg"
            />
          </audio>
          {isPlaying ? (
            <PauseIcon className="h-7 w-7" />
          ) : (
            <PlayIcon className="h-7 w-7 " />
          )}
        </div>
      ) : null}
    </div>
  );
}
