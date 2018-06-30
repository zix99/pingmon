const Promise = require('bluebird');
const db = require('./db');
const config = require('./config');

module.exports = {
  getTargetServers() {
    return Promise.resolve(config.targets);
  },

  getMostRecentPingTimeFor(target) {

  },

  // Returns
  getPingTimesFor(target, since = null) {

  },

  // More complicated method to get all routes (expressed as ttls)
  // Returns an array of arrays. Outer array is ttls
  // eg.
  // { hops: [ [{ ip, host, average, max, min}, ...], ... ] }
  getStatisticalSeriesFor(target, since = null) {

  },
};
