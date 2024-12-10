import { PLATFORMS } from '../config/constants.js';

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function getPlatform(url) {
  const hostname = new URL(url).hostname.toLowerCase();
  
  if (PLATFORMS.YOUTUBE.some(domain => hostname.includes(domain))) return 'youtube';
  if (PLATFORMS.INSTAGRAM.some(domain => hostname.includes(domain))) return 'instagram';
  if (PLATFORMS.TIKTOK.some(domain => hostname.includes(domain))) return 'tiktok';
  if (PLATFORMS.FACEBOOK.some(domain => hostname.includes(domain))) return 'facebook';
  
  return null;
}