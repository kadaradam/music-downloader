export abstract class YouTubeInfoService {
  static async getVideoMetadata(url: string): Promise<YouTubeMetadata> {
    const response = await fetch(
      `https://noembed.com/embed?dataType=json&url=${url}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    const data = (await response.json()) as YouTubeMetadata;

    const videoId = data.thumbnail_url.split('/')[4];

    return {
      ...data,
      id: videoId,
    };
  }
}
