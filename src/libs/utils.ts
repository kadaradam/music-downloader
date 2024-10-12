export const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-zA-Z0-9-_]/g, '_');
};

export const getFilePath = (fileId: string): string => {
  return `${process.cwd()}/scripts/downloader/outputs/${fileId}.webm`;
};
