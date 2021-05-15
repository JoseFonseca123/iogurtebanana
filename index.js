const WebSocket = require('ws');
const socket = new WebSocket('wss://ws.finnhub.io?token=c1n1b8q37fkvp2lsfpig');
const datah = require('./dataHandler');
const dataHandler = new datah();
const utils = require("./utils");
const db = require("./models");
require('log-timestamp')

//var tickSubscribe = ['LIFE', 'ITRM', 'SOS', 'AEI'];
var tickSubscribe = ['BINANCE:BTCUSDT','BINANCE:XRPUSDT','BINANCE:DOGEUSDT','BINANCE:ETHUSDT','BINANCE:RLCUSDT','BINANCE:SUSHIUSDT','BINANCE:NANOUSDT','BINANCE:MATICUSDT','BINANCE:KSMUSDT',
                    'BINANCE:ADAUSDT','BINANCE:CAKEUSDT','BINANCE:DOTUSDT',,'BINANCE:THETAUSDT'];
global.Stocks = [];
let ticksArray = [];

// Connection opened -> Subscribe
socket.addEventListener('open', function (event) {

     utils.connectDb().then( a  => {
        tickSubscribe.forEach((tick,index) => {
            utils.fillDatabase(tick);
        })

        setTimeout(() => {
            tickSubscribe.forEach(tick => {
                socket.send(JSON.stringify({'type': 'subscribe', 'symbol': tick}))
                let base  = {"name": tick, "Minute": "0", "Price":-1, "Volume":-1, "secondaEMA":-1}
                global.Stocks.push(base)
            })
        },2000)
     }) ;        
});

// Listen for messages
socket.addEventListener('message', function (event) {

    const CandleData = JSON.parse(event.data)
    
    if (CandleData.type !== 'ping') {
        dataHandler.handleCandlestick(CandleData, ticksArray)
    }
});

// Unsubscribe
const unsubscribe = function (symbol) {
    socket.send(JSON.stringify({'type': 'unsubscribe', 'symbol': symbol}))
};