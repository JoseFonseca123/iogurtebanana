const candleStickDTO = require("./controllers/candleStick.controller");

const crypto_validator = function(tickName,minute,price, candleMaxPrice) {
    let candles = [];

    candleStickDTO.getLast5(tickName).then(candlesBD => {
        candlesBD.forEach(candleBD => {
            candles.push(candleBD.dataValues)
        })

        console.log("***************************************");
        console.log(tickName);
	console.log(price)
        console.log("cryptovalidator @ minute " + minute )

        if(candleGreen(candles,price) && upTrend(candles,price) &&
            !trendExhaust(candles,price) && !candleflat(candles,price)   
            && !candleExhaust(candles,price) && !lastBigRed(candles) 
            && !deadStar(candleMaxPrice,price)
        ) {
            console.log("\t BETTT \n")
            console.log("\t "+tickName+" \n")
            console.log("\t "+minute+" \n")
            console.log("\t "+price+" \n")
        }
    })
}

const candleGreen = function (candles,price) {
    console.log("candleGreen")
    console.log(price >= candles[0].closePrice*1.0005)
	console.log("candles[0].closePrice")	
	console.log(candles[0].closePrice)
    return price >= candles[0].closePrice*1.0005
}

const upTrend = function (candles,price) {
    console.log("UPTREND")
    console.log(candles[0].closePrice*1.0002 > candles[4].openPrice);
	console.log("candles[0].closePrice")
	console.log(candles[0].closePrice)
	console.log("candles[4].openPrice")
	console.log(candles[4].openPrice)
    return candles[0].closePrice*1.0005 > candles[4].openPrice;
}

const trendExhaust = function (candles,price) {
    console.log("trendExhaust")
	console.log("candles[0].closePrice")
	console.log(candles[0].closePrice)
	console.log("candles[4].openPrice")
	console.log(candles[4].openPrice)
    console.log(candles[0].closePrice >= candles[4].openPrice*1.05)
    return candles[0].closePrice >= candles[4].openPrice*1.05;
}

const candleflat = function (candles,price) {
    console.log("candleFlat")
	console.log("candles[0].closePrice >= price")
	 console.log(candles[0].closePrice)
    console.log(candles[0].closePrice*1.003 >= price)
    return candles[0].closePrice*1.003 >= price;
}

const candleExhaust = function (candles,price) {
    console.log("candleExhaust")
	console.log("candles[0].closePrice*1.05")
	console.log(candles[0].closePrice*1.05)
    console.log(price > candles[0].closePrice*1.05)
    return price > candles[0].closePrice*1.05;
}

const lastBigRed = function (candles,price) {
    console.log("lastBigRed")
	console.log("candles[0].closePrice*1.02")
	console.log(candles[0].closePrice*1.02)
    console.log(price <= candles[0].closePrice*1.02)
    return price <= candles[0].closePrice*1.02;
}

const deadStar = function (candleMaxPrice,price) {
    console.log("deadStar")
	console.log("candleMaxPrice")
	console.log(candleMaxPrice)
    console.log(candleMaxPrice >= price * 1.008)
    return candleMaxPrice >= price * 1.008;
}

module.exports = {crypto_validator}
