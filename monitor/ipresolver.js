const dns = require('dns');

const cache = {};

module.exports = {
  resolve(ip) {
    return new Promise((resolve) => {
      if (!ip) return resolve(null);
      if (cache[ip]) return cache[ip];

      return dns.reverse(ip, (err, hosts) => {
        if (err) return resolve(ip);
        cache[ip] = hosts[0];
        return resolve(hosts[0]);
      });
    });
  },
};
