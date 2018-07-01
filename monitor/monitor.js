#!/usr/bin/env node
const ping = require('net-ping');
const Promise = require('bluebird');
const uuid = require('uuid/v4');
const ipresolver = require('./ipresolver');
const config = require('./config');
const log = require('./log');
const db = require('./db');

const pinger = ping.createSession();

function resolveHostIp(target, err) {
  if (err != null) {
    if (err instanceof ping.TimeExceededError) return err.source;
    return null;
  }
  return target;
}

function getErrorName(err) {
  if (!err) return null;
  if (err instanceof ping.RequestTimedOutError) return 'RequestTimedOut';
  if (err instanceof ping.DestinationUnreachableError) return 'DestinationUnreachable';
  if (err instanceof ping.PacketTooBigError) return 'PacketTooBig';
  if (err instanceof ping.ParameterProblemError) return 'ParameterProblem';
  if (err instanceof ping.RedirectReceivedError) return 'Redirect';
  if (err instanceof ping.SourceQuenchError) return 'SourceQuench';
  if (err instanceof ping.TimeExceededError) return null; // TimeExceededError isn't a real error for this use case (just means we hit ttl)
  return `Unknown: ${err}`;
}

function refresh() {
  log.info('Refreshing...');

  return Promise.map(config.targets, server => new Promise((resolve, reject) => {
    log.info(`Pinging ${server}...`);
    const start = new Date();
    const batch = uuid();

    pinger.traceRoute(server, config.traceroute, (err, target, ttl, sent, recvd) => {
      const ip = resolveHostIp(target, err);
      ipresolver.resolve(ip).then((host) => {
        log.info(`[${target}] ${host} (${ttl}) ${recvd - sent}ms`);
        db.pinghops.create({
          batch,
          start,
          target,
          ip,
          host,
          ttl,
          error: getErrorName(err),
          millis: (recvd - sent),
        });
      });
    }, (err, target) => {
      log.info(`Finished pinging to ${target}: ${err}`);
      if (err) reject(err);
      resolve();
    });
  }), { concurrency: 1 });
}

function timerCallback() {
  try {
    refresh();
  } catch (e) {
    log.error(`Error refreshing: ${e}`);
  }
}

module.exports = {
  start() {
    log.info(`Pinging targets every ${config.frequency} seconds`);
    timerCallback();
    setInterval(timerCallback, config.frequency * 1000);
  },
};
