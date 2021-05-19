module.exports = (sequelize, Sequelize) => {
    const candleStick = sequelize.define("candleStick", {
            day: {
                type: Sequelize.INTEGER
            },
            hour: {
                type: Sequelize.INTEGER
            },
            minute: {
                type: Sequelize.INTEGER
            },
            Tick: {
                type: Sequelize.STRING
            },
            openPrice: {
                type: Sequelize.FLOAT
            },
            closePrice: {
                type: Sequelize.FLOAT
            },
            High: {
                type: Sequelize.FLOAT
            },
            Low: {
                type: Sequelize.FLOAT
            },
            volume: {
                type: Sequelize.FLOAT
            },
            SMA50volume: {
                type: Sequelize.FLOAT
            }
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['hour', 'minute', 'Tick']
                }
            ]
        });

    return candleStick;
};