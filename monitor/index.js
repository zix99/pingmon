#!/usr/bin/env node
const ping = require('net-ping');
const _ = require('lodash');
const Promise = require('bluebird');
const ipresolver = require('./ipresolver');
const config = require('./config');
const log = require('./log');

const pinger = ping.createSession();

function resolveHostIp(target, err) {
  if (err != null) {
    if (err instanceof ping.TimeExceededError) return err.source;
    return null;
  }
  return target;
}

function refresh() {
  log.info('Refreshing...');

  return Promise.map(config.targets, (server) => {
    return new Promise((resolve, reject) => {
      log.info(`Pinging ${server}...`);
      pinger.traceRoute(server, config.traceroute, (err, target, ttl, sent, recvd) => {
        const ip = resolveHostIp(target, err);
        ipresolver.resolve(ip).then((host) => {
          log.info(`[${target}] ${host} (${ttl}) ${recvd - sent}ms`);
        });
      }, (err, target) => {
        log.info(`Finished pinging to ${target}: ${err}`);
        if (err) reject(err);
        resolve();
      });
    });
  }, { concurrency: 1 });
}

function timerCallback() {
  try {
    refresh();
  } catch (e) {
    log.error(`Error refreshing: ${e}`);
  }
}

log.info(`Pinging targets every ${config.frequency} seconds`);
timerCallback();
setInterval(timerCallback, config.frequency * 1000);
