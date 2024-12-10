import pkg from '@tobyg74/tiktok-api-dl';
const { Tiktok } = pkg;
import { downloadFile } from '../utils/downloader.js';
import { MESSAGES } from '../config/messages.js';

export async function handleTikTok(ctx, url) {
  try {
    const result = await Tiktok(url);
    
    if (result.status === 'success' && result.result.video) {
      await ctx.reply(MESSAGES.VIDEO_LOADING);
      await downloadFile(ctx, result.result.video[0], 'video');

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