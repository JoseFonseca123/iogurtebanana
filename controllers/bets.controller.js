const db = require("../models");
const Bets = db.bets;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (hourvar, minutevar, tickvar, volumevar, sma50volume, openPricevar, closePricevar, highvar, lowvar) => {

    const bets = {
        hour: hourvar,
        minute: minutevar,
        Tick: tickvar,
        volume: volumevar,
        openPrice: openPricevar,
        closePrice: closePricevar,
        SMA50volume: sma50volume,
        High: highvar,
        Low: lowvar,
        executed: false
    };

    // Save Tutorial in the database
    Bets.create(bets)
        .then(data => {
            //res.send(data);
        })
        .catch(err => {
            console.log(err.message || "Some error occurred while creating the Bets.")
        });
};


exports.findbyMinute = Minute => {
    return Bets.findAll({where: {minute: Minute}})
        .then(data => {
            return data
        })
        .catch(err => {
            console.log("Some error occurred while retrieving tutorials", err)
        });
}

// Retrieve all Tutorials from the database.
exports.findAll = () => {
    return Bets.findAll()
        .then(data => {
            return data
        })
        .catch(err => {
            console.log("Some error occurred while retrieving tutorials", err)
        });
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