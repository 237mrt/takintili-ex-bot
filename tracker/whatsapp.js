import puppeteer from 'puppeteer';
import { TARGET_NAME } from '../config.js';
import { sendMessage } from '../notifiers/telegram.js';
import { formatDate } from '../utils/formatDate.js';


let isOnline = false;
let lastOnlineTime = null;

export async function startTracking() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://web.whatsapp.com');
    console.log('QR kodu okut. Hazır olunca ENTER\'a bas.');
    process.stdin.once('data', async () => {
        await page.waitForSelector(`span[title="${TARGET_NAME}"]`);
        await page.click(`span[title="${TARGET_NAME}"]`);
        console.log(`${TARGET_NAME} profiline girildi.`);

        while (true) {
            try {
                const isCurrentlyOnline = await page.evaluate(() => {
                    const el = document.querySelector('span[title="çevrimiçi"]');
                    return !!el;
                });

                if (isCurrentlyOnline && !isOnline) {
                    isOnline = true;
                    lastOnlineTime = Date.now();
                    sendMessage(`📅 ${formatDate()}\n${TARGET_NAME} şu an çevrim içi.`);

                    console.log('Çevrim içi oldu.');
                } else if (!isCurrentlyOnline && isOnline) {
                    isOnline = false;
                    const now = Date.now();
                    const diffSec = Math.floor((now - lastOnlineTime) / 1000);
                    const minutes = Math.floor(diffSec / 60);
                    const seconds = diffSec % 60;
                    sendMessage(`📅 ${formatDate()}\n${TARGET_NAME} çevrim dışı oldu. Süre: ${minutes} dk ${seconds} sn`);

                    console.log(`${formatDate()} >> Çevrim içi oldu.`);

                }
            } catch (err) {
                console.error('Hata:', err);
            }

            await new Promise(r => setTimeout(r, 1000)); // 1 sn bekliyorusssssss
        }
    });
}
