import { TELEGRAM_BOT_TOKEN, TELEGRAM_USER_ID } from '../config.js';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

export async function sendMessage(text) {
    try {
        await bot.telegram.sendMessage(TELEGRAM_USER_ID, text);
    } catch (err) {
        console.error('Telegram mesaj hatası:', err);
    }
}
