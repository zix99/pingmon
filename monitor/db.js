const Sequelize = require('sequelize');
const log = require('./log');
const config = require('./config');

const db = new Sequelize(config.db, {
  logging: txt => log.debug(txt),
});

const ping = db.define('ping', {
  batch: Sequelize.STRING,
  target: Sequelize.STRING,
  start: Sequelize.DATE,
  responseIp: Sequelize.STRING,
  responseHost: Sequelize.STRING,
  error: Sequelize.STRING,
  ttl: Sequelize.INTEGER,
  millis: Sequelize.INTEGER, // ??
}, {
  indexes: [
    { fields: ['batch', 'target'] },
  ],
});

module.exports = {
  db,
  ping,
};
