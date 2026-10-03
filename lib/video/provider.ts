/**
 * Cineva Video Provider Abstraction
 * 
 * Per DETAILS.md specifications:
 * - Vercel should NEVER proxy or pipe large video files.
 * - Video streaming and subtitles are requested directly by the client browser from external CDNs/Storage.
 * - Providers can be swapped seamlessly (Cloudflare R2, Bunny Stream, S3, or direct CDN)
 *   without modifying the player or UI components.
 */

export interface VideoPlaybackSource {
  streamUrl: string;
  isHls?: boolean;
  qualities?: { label: string; url: string }[];
  providerName: string;
}

export interface VideoProvider {
  name: string;
  getVideoUrl(contentId: string, rawUrl: string): Promise<string>;
  getSubtitleUrl(contentId: string, language: string, rawUrl: string): Promise<string>;
  resolvePlaybackSource(contentId: string, rawUrl: string): Promise<VideoPlaybackSource>;
}

export class DirectCdnProvider implements VideoProvider {
  name = 'Direct CDN / External Storage';
  private baseUrl: string;
  private subtitleBaseUrl: string;

  constructor() {
    this.baseUrl = process.env.VIDEO_CDN_BASE_URL || '';
    this.subtitleBaseUrl = process.env.SUBTITLE_CDN_BASE_URL || '';
  }

  async getVideoUrl(contentId: string, rawUrl: string): Promise<string> {
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl;
    }
    if (this.baseUrl) {
      return `${this.baseUrl.replace(/\/$/, '')}/${rawUrl.replace(/^\//, '')}`;
    }
    return rawUrl;
  }

  async getSubtitleUrl(contentId: string, language: string, rawUrl: string): Promise<string> {
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl;
    }
    if (this.subtitleBaseUrl) {
      return `${this.subtitleBaseUrl.replace(/\/$/, '')}/${rawUrl.replace(/^\//, '')}`;
    }
    return rawUrl;
  }

  async resolvePlaybackSource(contentId: string, rawUrl: string): Promise<VideoPlaybackSource> {
    const streamUrl = await this.getVideoUrl(contentId, rawUrl);
    const isHls = streamUrl.endsWith('.m3u8');
    return {
      streamUrl,
      isHls,
      providerName: this.name,
    };
  }
}

export class CloudflareR2Provider extends DirectCdnProvider {
  override name = 'Cloudflare R2 Object Storage';
}

export class GoogleDriveFallbackProvider implements VideoProvider {
  name = 'Google Drive (Dev/Testing Fallback)';

  async getVideoUrl(contentId: string, rawUrl: string): Promise<string> {
    // Note per DETAILS.md Section 34:
    // Google Drive is strictly a dev fallback, not a scalable production CDN.
    // Handles Google Drive file IDs and transforms them to direct embed/streamable endpoints where applicable.
    if (rawUrl.includes('drive.google.com')) {
      const match = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || rawUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        // Direct media stream link format
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    return rawUrl;
  }

  async getSubtitleUrl(contentId: string, language: string, rawUrl: string): Promise<string> {
    return rawUrl;
  }

  async resolvePlaybackSource(contentId: string, rawUrl: string): Promise<VideoPlaybackSource> {
    const streamUrl = await this.getVideoUrl(contentId, rawUrl);
    return {
      streamUrl,
      isHls: false,
      providerName: this.name,
    };
  }
}

export function getVideoProvider(): VideoProvider {
  const providerType = (process.env.VIDEO_PROVIDER || 'cdn').toLowerCase();

  switch (providerType) {
    case 'r2':
    case 'cloudflare':
      return new CloudflareR2Provider();
    case 'gdrive':
    case 'googledrive':
      return new GoogleDriveFallbackProvider();
    case 'cdn':
    default:
      return new DirectCdnProvider();
  }
}
