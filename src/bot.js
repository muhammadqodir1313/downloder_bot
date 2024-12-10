import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { handleYouTube, handleInstagram, handleTikTok, handleFacebook } from './handlers/index.js';
import { isValidUrl, getPlatform } from './utils/validator.js';
import { handleError } from './utils/error-handler.js';
import { MESSAGES } from './config/messages.js';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx) => {
  ctx.reply(MESSAGES.WELCOME);
});

bot.command('help', (ctx) => {
  ctx.reply(MESSAGES.HELP);
});

bot.on('text', async (ctx) => {
  const url = ctx.message.text;

  if (!isValidUrl(url)) {
    return ctx.reply(MESSAGES.INVALID_URL);
  }

  try {
    await ctx.reply(MESSAGES.DOWNLOADING);
    const platform = getPlatform(url);

    switch (platform) {
      case 'youtube':
        await handleYouTube(ctx, url);
        break;
      case 'instagram':
        await handleInstagram(ctx, url);
        break;
      case 'tiktok':
        await handleTikTok(ctx, url);
        break;
      case 'facebook':
        await handleFacebook(ctx, url);
        break;
      default:
        await ctx.reply(MESSAGES.UNSUPPORTED_URL);
    }
  } catch (error) {
    await handleError(ctx, error);
  }
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));