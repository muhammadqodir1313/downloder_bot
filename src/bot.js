import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { handleInstagram } from './handlers/index.js';
import { isValidUrl, getPlatform } from './utils/validator.js';
import { handleError } from './utils/error-handler.js';
import { MESSAGES } from './config/messages.js';
import express from 'express';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

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
      case 'instagram':
        await handleInstagram(ctx, url);
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));