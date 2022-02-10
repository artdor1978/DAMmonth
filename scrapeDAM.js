const puppeteer = require('puppeteer');

async function scrape(monthScrape) {
  /*   const chromeOptions = {
        headless: false,
        defaultViewport: null,
        args: [
            "--incognito",
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
        ],
    }; */
    console.log("ddddd", monthScrape);
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://www.oree.com.ua/index.php/pricectr');
    await page.waitForTimeout(2500);
    await page.waitForSelector('.datepicker');
    await page.click('.datepicker')

    const choosenMonth = monthScrape - 1;
    const aElementsWithHi = await page.$$(".month");
    await page.waitForTimeout(2500);
    console.log(choosenMonth);
    await aElementsWithHi[choosenMonth].click();
    await page.waitForTimeout(2500);

    await page.waitForSelector('tbody');
    await page.waitForTimeout(2500);
    const RDNdata = await page.$$eval("tbody", (nodes) =>
        nodes.map((n) => n.innerText)
    );
    RDNdata.splice(RDNdata.length / 2, RDNdata.length / 2);
    const dateData = RDNdata[0].split("\n");
    const values2 = dateData.map(x => x.split(/\s/g));
    values2.map(x => x.shift());
    const values = values2.map(x => x.map(Number));
    console.log(values);
    await browser.close();
    return values;
};

/* async function getResult() {
    let result = await scrape(1); // Blocked on this line
    console.log("dddd",result); // Will not be executed before makeResult() is done
  }
getResult(); */
module.exports = {
    scrape,
};
