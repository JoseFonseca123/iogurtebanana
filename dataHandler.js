const request = require('request');
const candleStickDTO = require("./controllers/candleStick.controller");
const utils = require("./utils");
const validator = require("./validator");
const crypto_validator = require("./crypto_validator");
require('log-timestamp')

module.exports = class dataHandler {

handleCandlestick(CandleData) {

CandleData.data.forEach(candle => {
    global.Stocks.forEach((stock, index) => {
        if (stock.name === candle.s) {

            let candleMinute = utils.unixToDate(candle.t).getMinutes();
            let candleSeconds = utils.unixToDate(candle.t).getSeconds();

            if (candleMinute === global.Stocks[index].Minute) {
                global.Stocks[index].Volume += candle.v;

                if(candle.p > global.Stocks[index].candleMaxPrice)
                    global.Stocks[index].minutePriceMax = candle.p

                if (candleSeconds > global.Stocks[index].secondaEMA) {
                    this.checkEMA(stock.name, global.Stocks[index].Volume, candleMinute, candle.p, global.Stocks[index].candleMaxPrice)
                    global.Stocks[index].secondaEMA = candleSeconds;
                }

            } else if (candleMinute > global.Stocks[index].Minute || candleMinute === 0) {
                this.saveCandle(candle.s)
                //console.log(candle.s + ": at " + candleMinute + " min there were " + global.Stocks[index].Volume + " stocks ");
                global.Stocks[index].Minute = candleMinute;
                global.Stocks[index].Volume = 0;
                global.Stocks[index].secondaEMA = 1;
                global.Stocks[index].candleMaxPrice = 0;
            }
        }
    })
})
}

async checkEMA(tickName, volume, startMinute,price,candleMaxPricepriceMax) {
    let minutesForRequest = utils.generateDate1M();
    utils.calculateEMA(tickName, minutesForRequest.hour, startMinute, volume)
        .then(ema55 => {
            if (volume>=ema55*4.2) {
                if(tickName.includes('BINANCE'))
                    crypto_validator.crypto_validator(tickName, startMinute, price, candleMaxPricepriceMax)
                else
                    validator.validator(tickName, startMinute, price, candleMaxPricepriceMax)
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
                                //console.log("Create new Candle for minute: " + startMinute);
                                if(startMinute === 59) {
                                    minutesForRequest.hour --
                                }
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