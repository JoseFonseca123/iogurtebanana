const candleStickDTO = require("./controllers/candleStick.controller");

const validator = function(tickName,minute,price) {
    let candles = [];


    candleStickDTO.getLast5(tickName).then(candlesBD => {
        candlesBD.forEach(candleBD => {
            candles.push(candleBD.dataValues)
        })

        console.log(minute)

        if(candleGreen(candles,price) && upTrend(candles,price) &&
            !trendExhaust(candles,price) && !candleExhaust(candles,price)
            && !lastBigRed(candles)
        ) {
            console.log("\n\n\t BETTT \n")
            console.log("\t "+tickName+" \n")
            console.log("\t "+minute+" \n")
            console.log("\t "+price+" \n")
        }
    })
}

const candleGreen = function (candles,price) {
    console.log("candleGreen")
    console.log(price >= candles[0].closePrice*1.0005)
    return price >= candles[0].closePrice*1.0005
}

const upTrend = function (candles,price) {
    console.log("UPTREND")
    console.log(candles[0].closePrice*1.0002 > candles[4].openPrice);
    return candles[0].closePrice*1.0005 > candles[4].openPrice;
}

const trendExhaust = function (candles,price) {
    console.log("trendExhaust")
    console.log(candles[0].closePrice >= candles[4].openPrice*1.0005)
    return candles[0].closePrice >= candles[4].openPrice*1.00055;
}

const candleExhaust = function (candles,price) {
    console.log("candleExhaust")
    console.log(price > candles[0].closePrice*1.005)
    return price > candles[0].closePrice*1.005;
}

const lastBigRed = function (candles,price) {
    console.log("lastBigRed")
    console.log(price <= candles[0].closePrice*1.001)
    return price <= candles[0].closePrice*1.001;
}

module.exports = {validator}