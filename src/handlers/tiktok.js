import { TiktokDL } from "@tobyg74/tiktok-api-dl";
import { downloadFile } from '../utils/downloader.js';
import { MESSAGES } from '../config/messages.js';

export async function handleTikTok(ctx, url) {
  try {
    const result = await TiktokDL(url);
    
    if (result.status === "success") {
      const videoUrl = result.result.video[0];
      
      await ctx.reply(MESSAGES.VIDEO_LOADING);
      await downloadFile(ctx, videoUrl, 'video');

      if (result.result.music) {
        await ctx.reply(MESSAGES.AUDIO_LOADING);
        await downloadFile(ctx, result.result.music, 'audio');
      }
    } else {
      throw new Error('No downloadable content found');
    }
  } catch (error) {
    console.error('TikTok handler error:', error);
    throw error;
  }
}