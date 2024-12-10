import ytdl from 'ytdl-core';
import { downloadFile } from '../utils/downloader.js';
import { MESSAGES } from '../config/messages.js';

export async function handleYouTube(ctx, url) {
  try {
    const info = await ytdl.getInfo(url);
    
    // Get highest quality video format
    const videoFormats = ytdl.filterFormats(info.formats, 'videoonly');
    const videoFormat = videoFormats.sort((a, b) => b.bitrate - a.bitrate)[0];
    
    // Get highest quality audio format
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const audioFormat = audioFormats.sort((a, b) => b.bitrate - a.bitrate)[0];

    if (videoFormat) {
      await ctx.reply(MESSAGES.VIDEO_LOADING);
      await downloadFile(ctx, videoFormat.url, 'video');
    }

    if (audioFormat) {
      await ctx.reply(MESSAGES.AUDIO_LOADING);
      await downloadFile(ctx, audioFormat.url, 'audio');
    }
  } catch (error) {
    console.error('YouTube handler error:', error);
    throw error;
  }
}