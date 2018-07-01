const Sequelize = require('sequelize');
const log = require('./log');
const config = require('./config');

const db = new Sequelize(config.db, {
  logging: txt => log.debug(txt),
});

const pinghops = db.define('pinghops', {
  batch: Sequelize.STRING,
  target: Sequelize.STRING, // The end-target
  start: Sequelize.DATE,
  ip: Sequelize.STRING, // the hop ip
  host: Sequelize.STRING, // the hop host
  error: Sequelize.STRING,
  ttl: Sequelize.INTEGER,
  millis: Sequelize.INTEGER,
}, {
  indexes: [
    { fields: ['batch', 'target'] },
  ],
});

module.exports = {
  db,
  pinghops,
};
