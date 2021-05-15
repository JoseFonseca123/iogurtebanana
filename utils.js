const EMA = require('technicalindicators').EMA;
const technicalIndicators = require('technicalindicators');
const request = require('request');
const candleStickDTO = require("./controllers/candleStick.controller");
const db = require("./models");

technicalIndicators.setConfig('precision', 10);

const connectDb = async (retries = 5) => {
    while (retries) {
      try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
        break;
      } catch (err) {
        console.log(err);
        retries -= 1;
        console.log(`retries left: ${retries}`);
        // wait 5 seconds
        await new Promise(res => setTimeout(res, 60000));
      }
    }
  };



const unixToDate = function(unixDate) {
    return new Date(unixDate)
}

const generateDate1M = function () {

    date = Date.now() + 5000;
    let newDate = new Date(date);
    let minute_1 = Math.floor(newDate / 1000 - newDate.getSeconds());
    let minute_0 = minute_1 - 60;

    const hour = (minute_1 === 0) ? newDate.getHours()-1 : newDate.getHours();

    return { 'hour':hour, 'initialMinute': minute_0,'finalMinute':minute_1};
}

const generateDate1H = function () {
    //+ 5 sec because server time is ahead 0.5s of local time
    date = Date.now() + 5000;
    let newDate = new Date(date);
    let minute_1 = Math.floor(newDate / 1000 - newDate.getSeconds());
    let minute_0 = minute_1 - 60*60;

    const hour = (minute_1 === 0) ? newDate.getHours() : newDate.getHours() - 1;

    return { 'hour':hour, 'initialMinute': minute_0,'finalMinute':minute_1};
}

const generateDate4H = function () {
    //+ 5 sec because server time is ahead 0.5s of local time
    date = Date.now() + 5000;
    let newDate = new Date(date);
    let minute_1 = Math.floor(newDate / 1000 - newDate.getSeconds());
    let minute_0 = minute_1 - 60*60*4;

    const hour = (minute_1 === 0) ? newDate.getHours() : newDate.getHours() - 1;

    return { 'hour':hour, 'initialMinute': minute_0,'finalMinute':minute_1};
}

const generateURL = function (tickName,minutesForRequest) {
    return 'https://finnhub.io/api/v1/stock/candle?symbol=' + tickName + '&resolution=1&from='
        + minutesForRequest.initialMinute + '&to=' + minutesForRequest.finalMinute + '&token=c1n1b8q37fkvp2lsfpig'
}

const fillDatabase = function (tickName) {

    let minutesForRequest = generateDate4H()
    let URL = generateURL(tickName,minutesForRequest)

    console.log(minutesForRequest)
    console.log(URL)

    db.sequelize.sync({force: false}).then(() => {
        console.log("Drop and re-sync db.");
    }).then(
    request(URL, {json: true}, (err, res, body) => {
        if (err)
            return console.log(err);
        else {
            if (body.s === 'ok') {
                for(let i = 0; i<59*4 ; i++)
                {
                    let responseDate = unixToDate(body.t[i]*1000)
                    candleStickDTO.create(responseDate.getHours(), responseDate.getMinutes(), tickName, body.v[i],
                        0, body.o[i], body.c[i], body.h[i], body.l[i])
                    console.log("Candle " + tickName +  " DBCreated")
                }
            }
        }
    }))
}

const orderArray = function (array) {
    array = array.sort((a, b) => {
        let retval = 0;
        if (a.hour < b.hour)
            retval = -1;
        if (a.hour > b.hour)
            retval = 1;
        if (retval === 0)
            retval = a.minute < b.minute ? -1 : 1;
        return retval;
    });
    return array
}

const emaMATH = async function (volumeArray,volume) {

    let volumeArrayAux = [];
    volumeArray = orderArray(volumeArray)

    if( volumeArray.length >= 49 ) {
        volumeArray.forEach(value => {
            volumeArrayAux.push(value.volume)
        })

        var ema = new EMA({period : 50, values : volumeArrayAux});
        ema.getResult()
        return ema.nextValue(volume);
    }
     else {
         console.log("NOT ENOUGH VALUES TO CALCULATE EMA")
     }
    
}

const calculateEMA = async function (tickName, hour, minute, volume) {

    return new Promise(function (resolve, reject) {

            let volumeArray = [];

                candleStickDTO.get55Interval(tickName).then(candlesBD => {
                    candlesBD.forEach(candleBD => {
                        volumeArray.push({
                            volume: candleBD.dataValues.volume, minute: candleBD.dataValues.minute,
                            hour: candleBD.dataValues.hour
                        })
                    })
                    return volumeArray;
                }).then (volumeArray => {
                    resolve(emaMATH(volumeArray, volume));
                })}
    ).then(result => {
        return result;
    })
}

module.exports = {connectDb,unixToDate, generateDate1M,generateDate1H,generateDate4H,calculateEMA,generateURL,fillDatabase}