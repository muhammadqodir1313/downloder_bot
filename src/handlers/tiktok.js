import TikTokScraper from 'tiktok-scraper';
import { downloadFile } from '../utils/downloader.js';
import { MESSAGES } from '../config/messages.js';

export async function handleTikTok(ctx, url) {
  try {
    const videoMeta = await TikTokScraper.getVideoMeta(url);
    
    if (videoMeta && videoMeta.collector[0]) {
      const videoUrl = videoMeta.collector[0].videoUrl;
      
      await ctx.reply(MESSAGES.VIDEO_LOADING);
      await downloadFile(ctx, videoUrl, 'video');

      if (videoMeta.collector[0].musicMeta) {
        await ctx.reply(MESSAGES.AUDIO_LOADING);
        await downloadFile(ctx, videoMeta.collector[0].musicMeta.musicUrl, 'audio');
      }
    } else {
      throw new Error('No downloadable content found');
    }
  } catch (error) {
    console.error('TikTok handler error:', error);
    throw error;
  }
}