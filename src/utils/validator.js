import { PLATFORMS } from '../config/constants.js';

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

export function getPlatform(url) {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.toLowerCase();

  if (hostname.includes(PLATFORMS.INSTAGRAM[0])) {
    return 'instagram';
  }

  return null;
}