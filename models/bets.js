module.exports = (sequelize, Sequelize) => {
    const bets = sequelize.define("bets", {
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
          },
          executed: {
            type: Sequelize.BOOLEAN
          },
        },
        {
          indexes: [
            {
              unique: true,
              fields: ['hour', 'minute', 'Tick']
            }
          ]
        });

    return bets;
  };