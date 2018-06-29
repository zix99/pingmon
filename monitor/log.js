const winston = require('winston');
const config = require('./config');

module.exports = winston.createLogger({
  level: config.verbose ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
