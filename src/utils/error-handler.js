import { MESSAGES } from '../config/messages.js';

export class DownloadError extends Error {
  constructor(message, type) {
    super(message);
    this.type = type;
  }
}

export function handleError(ctx, error) {
  console.error('Error:', error);

  switch(error.type) {
    case 'FORBIDDEN':
      return ctx.reply(MESSAGES.FORBIDDEN_ERROR);
    case 'TIMEOUT':
      return ctx.reply(MESSAGES.TIMEOUT_ERROR);
    default:
      return ctx.reply(MESSAGES.ERROR);
  }
}