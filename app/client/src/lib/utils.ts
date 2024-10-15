import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validYouTubeUrlPattern =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;

export const getYtVideoThumbnail = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

// Source: https://dev.to/shubhamkumar10/converting-date-to-relative-time-format-in-typescript-4iap
export function prettyDate(date: Date): string {
  const secondsDiff = Math.round((date.getTime() - Date.now()) / 1000);
  const unitsInSec = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];

  const unitStrings: Intl.RelativeTimeFormatUnit[] = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year',
  ];

  const unitIndex = unitsInSec.findIndex(
    (cutoff) => cutoff > Math.abs(secondsDiff),
  );

  const divisor = unitIndex ? unitsInSec[unitIndex - 1] : 1;
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const relativeTime = rtf.format(
    Math.floor(secondsDiff / divisor),
    unitStrings[unitIndex],
  );

  return relativeTime;
}
