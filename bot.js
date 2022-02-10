const { Telegraf, Markup } = require('telegraf')
const { scrape } = require('./scrapeDAM');
const { setData, getSheet } = require('./setValues');
//const getText = require('./convert');
const getScreen = require('./screen');

require('dotenv').config()
const token = process.env.BOT_TOKEN
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Telegraf(token)

bot.use(Telegraf.log())

bot.command('start', ctx => {
    console.log(ctx.from)
    ctx.reply('Оберіть місяць:', Markup
        .keyboard([
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8'],
            ['9', '10', '11', '12']
        ])
        .oneTime()
        .resize()
    )
})

bot.hears(/\d+/, ctx => {
    //ctx.reply(ctx.message.text);
    scrape(ctx.message.text).then((data) => {
        setData(data, ctx.message.text).then(() => {
            getSheet(ctx.message.text).then((res) => {
                getScreen(res).then(() => {
                    bot.telegram.sendPhoto(ctx.chat.id, {
                        source: "./verification.png"
                    })
                }).catch((err) => {
                    console.log(err)
                });
            })
        })
    })
})
    bot.launch()

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))