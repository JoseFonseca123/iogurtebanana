const request = require('request');
const candleStickDTO = require("./controllers/candleStick.controller");
const utils = require("./utils");
const validator = require("./validator");
require('log-timestamp')

module.exports = class dataHandler {

handleCandlestick(CandleData, ticksArray) {

CandleData.data.forEach(candle => {
    global.Stocks.forEach((stock, index) => {
        if (stock.name === candle.s) {

            let candleMinute = utils.unixToDate(candle.t).getMinutes();
            let candleSeconds = utils.unixToDate(candle.t).getSeconds();

            if (candleMinute === global.Stocks[index].Minute) {
                global.Stocks[index].Volume += candle.v;

                if (candleSeconds > global.Stocks[index].secondaEMA) {
                    this.checkEMA(stock.name, global.Stocks[index].Volume, candleMinute, candle.p)
                    global.Stocks[index].secondaEMA = candleSeconds;
                }

            } else if (candleMinute > global.Stocks[index].Minute || candleMinute === 0) {
                this.saveCandle(candle.s)
                //console.log(candle.s + ": at " + candleMinute + " min there were " + global.Stocks[index].Volume + " stocks ");
                global.Stocks[index].Minute = candleMinute;
                global.Stocks[index].Volume = 0;
                global.Stocks[index].secondaEMA = 1;
            }
        }
    })
})
}

async checkEMA(tickName, volume, startMinute,price) {
    let minutesForRequest = utils.generateDate1M();
    utils.calculateEMA(tickName, minutesForRequest.hour, startMinute, volume)
        .then(ema55 => {
            if (volume>=ema55*4.2 ) {
                console.log("\n\n\n\t   EMA OVER!!!!!!!!!!!!!!!")
                console.log("\n\n\n\t   "+tickName)
                console.log("\n\n\n\t   "+startMinute)
                //validator.validator(tickName, startMinute, price)
            }
        })
}

async saveCandle(tickName) {
    let minutesForRequest = utils.generateDate1M();
    let URL = utils.generateURL(tickName, minutesForRequest)

    return new Promise(function (resolve, reject) {
            request(URL, {json: true}, (err, res, body) => {
                if (body.s === 'ok') {
                    let startMinute = utils.unixToDate(minutesForRequest.initialMinute * 1000).getMinutes()

                    utils.calculateEMA(tickName, minutesForRequest.hour, startMinute + 1, body.v[0])
                        .then(ema55 => {

                            /*console.log(minutesForRequest.hour)
                            console.log(startMinute)
                            console.log(tickName)
                            console.log(body.v[0])
                            console.log(ema55)
                            console.log(body.o[0])
                            console.log(body.c[0])
                            console.log(body.h[0])
                            console.log(body.l[0])*/

                                candleStickDTO.create(minutesForRequest.hour, startMinute, tickName, body.v[0],
                                    ema55, body.o[0], body.c[0], body.h[0], body.l[0])
                            }
                        )
                }
            })
        }
    );
}
}