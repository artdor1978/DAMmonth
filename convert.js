const { google } = require('googleapis');
const puppeteer = require('puppeteer');

async function scrape(monthScrape) {
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
    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://www.oree.com.ua/index.php/pricectr');
    await page.waitForSelector('.datepicker');
    await page.click('.datepicker')

    const choosenMonth = monthScrape - 1;
    const aElementsWithHi = await page.$$(".month");
    console.log(aElementsWithHi);
    await aElementsWithHi[choosenMonth].click();
    await page.waitForTimeout(1500);

    await page.waitForSelector('tbody');
    await page.waitForTimeout(1500);
    const RDNdata = await page.$$eval("tbody", (nodes) =>
        nodes.map((n) => n.innerText)
    );
    RDNdata.splice(RDNdata.length / 2, RDNdata.length / 2);
    const dateData = RDNdata[0].split("\n");
    const values2 = dateData.map(x => x.split(/\s/g));
    values2.map(x => x.shift());
    let values = values2.map(x => x.map(Number));
    await browser.close();

    const sheets = google.sheets('v4');
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
    const spreadsheetId = "1PXj2pH6VJd5O8QyWn-4qElAvHwJQiBRsZIHU93rAlC8";

    const auth = new google.auth.GoogleAuth({
        scopes: SCOPES,
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
    const authClient = await auth.getClient();
    const resource = {
        values,
    };
    const range = "'РДН-" + new Date(2022, choosenMonth, 01).toLocaleString('ru-RU', { month: 'long' }).charAt(0).toUpperCase() + new Date(2022, choosenMonth, 01).toLocaleString('ru-RU', { month: 'long' }).slice(1) + " 2022'!C17"
    sheets.spreadsheets.values.update(
        {
            spreadsheetId,
            auth: authClient,
            range,
            valueInputOption: 'RAW',
            resource,
        },
        (err, result) => {
            if (err) {
                // Handle error
                console.log(err);
            } else {
                console.log(
                    result.data
                );
            }
        }
    );
    try {
        const request = {
            spreadsheetId: spreadsheetId,
            ranges: range,
            includeGridData: false,
            auth: authClient,
        };

        res = await sheets.spreadsheets.get(request)
    } catch (error) {
        console.log("Error get sheetId")
    }




};
const currentSheet = res.data.sheets[0].properties.sheetId;

module.exports = {
    scrape,
    currentSheet,
};