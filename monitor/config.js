module.exports = require('rc')('pingmon', {
  targets: [
    '8.8.8.8',
    '8.8.4.4',
  ],
  http: {
    host: '127.0.0.1',
    port: '9001',
  },
  frequency: 10,
  traceroute: {
    ttl: 12,
    maxHopTimeouts: 3,
    startTtl: 1,
  },
  db: 'sqlite://pingmon.db',
  verbose: true,
});
