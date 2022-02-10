const { google } = require('googleapis');
const sheets = google.sheets('v4');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const spreadsheetId = "1PXj2pH6VJd5O8QyWn-4qElAvHwJQiBRsZIHU93rAlC8";
const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

async function setData(values, choosenMonth) {
    const authClient = await auth.getClient();
    const resource = {
        values,
    };
    const range = "'РДН-" + new Date(2022, choosenMonth - 1, 01).toLocaleString('ru-RU', { month: 'long' }).charAt(0).toUpperCase() + new Date(2022, choosenMonth - 1, 01).toLocaleString('ru-RU', { month: 'long' }).slice(1) + " 2022'!C17"

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
};

async function getSheet(choosenMonth) {
    const range = "'РДН-" + new Date(2022, choosenMonth - 1, 01).toLocaleString('ru-RU', { month: 'long' }).charAt(0).toUpperCase() + new Date(2022, choosenMonth - 1, 01).toLocaleString('ru-RU', { month: 'long' }).slice(1) + " 2022'!C17"
    const authClient = await auth.getClient();
    try {
        const request = {
            spreadsheetId: spreadsheetId,
            ranges: range,
            includeGridData: false,
            auth: authClient,
        };

        res = await sheets.spreadsheets.get(request);
        return res.data.sheets[0].properties.sheetId;
    } catch (error) {
        console.log("Error get sheetId")
    }
}

module.exports = {
    setData,
    getSheet,
};