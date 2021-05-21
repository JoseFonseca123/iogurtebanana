module.exports = (sequelize, Sequelize) => {
    const bets = sequelize.define("bets", {
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
          price: {
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
              fields: ['day','hour', 'minute', 'Tick']
            }
          ]
        });

    return bets;
  };