const puppeteer = require('puppeteer');
module.exports = async function scrape(currentSheet) {
    const chromeOptions = {
        headless: true,
        defaultViewport: null,
        args: [
            "--incognito",
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
        ],
    };
    const url = 'https://docs.google.com/spreadsheets/d/1PXj2pH6VJd5O8QyWn-4qElAvHwJQiBRsZIHU93rAlC8/edit#gid=' + currentSheet;
    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1480
    });
    await page.goto(url);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'verification.png', fullPage: true });
    await browser.close();
};