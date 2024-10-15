export type ConvertJobStatus = 'pending' | 'completed' | 'failed' | 'archived';
export type ConvertJob = {
  id: string;
  videoId: string;
  fileId: string;
  title: string;
  type: 'mp3';
  status: ConvertJobStatus;
  downloadCount: number;
  createdAt: string;
  finishedAt: string | null;
};
