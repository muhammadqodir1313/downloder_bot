import instagramGetUrl from 'instagram-url-direct';
import { downloadFile } from '../utils/downloader.js';
import { MESSAGES } from '../config/messages.js';

export async function handleInstagram(ctx, url) {
  try {
    const result = await instagramGetUrl(url);
    
    if (result.url_list && result.url_list.length > 0) {
      await ctx.reply(MESSAGES.VIDEO_LOADING);
      
      // Download each media in the post
      for (const mediaUrl of result.url_list) {
        const type = mediaUrl.includes('.mp4') ? 'video' : 'photo';
        if (type === 'video') {
          await downloadFile(ctx, mediaUrl, 'video');
        } else {
          await ctx.replyWithPhoto({ url: mediaUrl });
        }
      }
    } else {
      throw new Error('No downloadable content found');
    }
  } catch (error) {
    console.error('Instagram handler error:', error);
    throw error;
  }
}