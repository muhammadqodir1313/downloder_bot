import fbDownloader from 'fb-downloader';
import { downloadFile } from '../utils/downloader.js';
import { MESSAGES } from '../config/messages.js';

export async function handleFacebook(ctx, url) {
  try {
    const result = await fbDownloader(url);
    
    if (result && result.hd) {
      await ctx.reply(MESSAGES.VIDEO_LOADING);
      await downloadFile(ctx, result.hd, 'video');
    } else if (result && result.sd) {
      await ctx.reply(MESSAGES.VIDEO_LOADING);
      await downloadFile(ctx, result.sd, 'video');
    } else {
      throw new Error('No downloadable content found');
    }
  } catch (error) {
    console.error('Facebook handler error:', error);
    throw error;
  }
}