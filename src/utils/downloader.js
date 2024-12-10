import axios from 'axios';
import { DownloadError } from './error-handler.js';
import { CONFIG } from '../config/constants.js';

export async function downloadFile(ctx, url, type) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      timeout: CONFIG.DOWNLOAD_TIMEOUT,
      maxContentLength: CONFIG.MAX_FILE_SIZE,
      validateStatus: status => status === 200,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const contentLength = parseInt(response.headers['content-length'] || '0');
    if (contentLength > CONFIG.MAX_FILE_SIZE) {
      throw new DownloadError('File size exceeds limit', 'SIZE_LIMIT');
    }

    try {
      if (type === 'video') {
        await ctx.replyWithVideo({ source: response.data });
      } else if (type === 'audio') {
        await ctx.replyWithAudio({ source: response.data });
      }
    } catch (telegramError) {
      throw new DownloadError('Failed to send file to Telegram', 'TELEGRAM_ERROR');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new DownloadError('Download timeout', 'TIMEOUT');
      }
      if (error.response?.status === 403) {
        throw new DownloadError('Access forbidden', 'FORBIDDEN');
      }
    }
    throw error;
  }
}