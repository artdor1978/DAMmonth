const puppeteer = require('puppeteer');
(async function scrape() {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://www.oree.com.ua/index.php/pricectr');
    await page.waitForSelector('.datepicker');
    await page.click('.datepicker')

    const choosenMonth = 5;
    const aElementsWithHi = await page.$$(".month");
    console.log(aElementsWithHi);
    await aElementsWithHi[choosenMonth].click();
    await page.waitForTimeout(1500);

    await browser.close();
})();