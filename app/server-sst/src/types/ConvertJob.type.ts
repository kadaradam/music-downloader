export type ConvertJobStatus = 'pending' | 'completed' | 'failed' | 'archived';
export type ConvertJob = {
  id: string;
  videoId: string;
  fileId: string;
  title: string;
  type: 'mp3';
  status: ConvertJobStatus;
  createdAt: string;
  downloadCount: number;
  finishedAt?: string | null;
};
