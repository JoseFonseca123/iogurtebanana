const db = require("../models");
const CandleSticks = db.candleStick;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");

// Create and Save a new Tutorial
exports.create = (hourvar, minutevar, tickvar, volumevar, sma50volume, openPricevar, closePricevar, highvar, lowvar) => {
    // Validate request
    /*if (!minute || !tick || !volume) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }*/

    const candleSticks = {
        hour: hourvar,
        minute: minutevar,
        Tick: tickvar,
        volume: volumevar,
        openPrice: openPricevar,
        closePrice: closePricevar,
        SMA50volume: sma50volume,
        High: highvar,
        Low: lowvar
    };

    // Save CandleSticks in the database
    CandleSticks.create(candleSticks)
        .then(data => {
            //res.send(data);
        })
        .catch(err => {
            console.log(err.message || "Some error occurred while creating the candleSticks.")
        });
};


exports.findbyMinuteandHour = (Minute,Hour, Tick) => {
    return CandleSticks.findAll({where: {minute: Minute, hour:Hour, Tick:Tick}})
        .then(data => {
            return data
        })
        .catch(err => {
            console.log("Some error occurred while retrieving tutorials", err)
        });
}

// Retrieve all Tutorials from the database.
exports.findAll = () => {
    return CandleSticks.findAll()
        .then(data => {
            return data
        })
        .catch(err => {
            console.log("Some error occurred while retrieving candleSticks", err)
        });
};

exports.get55Interval = (tick) => {
    return CandleSticks.findAll({
        where: {
            Tick: tick
        },
        order: [
            ['hour', 'DESC'],
            ['minute', 'DESC'],
        ],
        limit: 55
    })
};

exports.getLast5 = (tick) => {
    return CandleSticks.findAll ({
        where: {
            Tick: tick
        },
        order: [
            ['hour', 'DESC'],
            ['minute', 'DESC'],
        ],
        limit: 5
    })
};


// Find a single Tutorial with an id
exports.findOne = (req, res) => {

};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
};

// Find all published Tutorials
//exports.findAllPublished = (req, res) => {//};