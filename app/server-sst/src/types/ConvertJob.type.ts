export type ConvertJob = {
  id: string;
  videoId: string;
  fileId: string;
  title: string;
  type: 'mp3';
  status: ConvertJobStatusEnum;
  createdAt: string;
  downloadCount: number;
  finishedAt?: string | null;
};

export enum ConvertJobStatusEnum {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ARCHIVED = 'archived',
}
