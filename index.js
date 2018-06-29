#!/usr/bin/env node
const express = require('express');
const ping = require('net-ping');
const dns = require('dns');


const session = ping.createSession();

/*
session.pingHost('8.8.8.8', (err, target, sent, recvd) => {
  if (err)
    console.log(err);
  else {
    console.log('result');
    console.dir(recvd - sent);
  }
});
*/

/* eslint-disable no-console */
console.log('Pinging: 8.8.8.8...');
session.traceRoute('8.8.8.8', { ttl: 16 }, (err, target, ttl, sent, recvd) => {
  const source = (err !== null && err instanceof ping.TimeExceededError) ? err.source : target;
  dns.reverse(source, (derr, host) => {
    console.log(`${host || source} (${ttl}) ${recvd - sent}ms`);
  });
}, () => {
  console.log('Done!');
});
