#!/usr/bin/env node
const express = require('express');
const log = require('./log');
const db = require('./db');
const config = require('./config');
const monitor = require('./monitor');

const { Op } = db.db;
const app = express();

app.use((req, res, next) => {
  log.debug(`${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Pingmon monitor application');
});

app.get('/status', (req, res) => {
  res.send({ status: 'OK' });
});

// Get all ping data for target with optional qp filters
app.get('/api/v1/target/:target', (req, res, next) => {
  const { since } = req.query;

  const where = {
    target: req.params.target,
  };

  if (since) where.start = { [Op.gt]: since };

  db.pinghops.findAll({
    where,
    order: [
      ['start', 'ASC'],
      ['ttl', 'ASC'],
    ],
  }).then((rows) => {
    res.send(rows);
  }).catch(next);
});

// Get latest data for target
app.get('/api/v1/target/:target/latest', (req, res, next) => {
  db.pinghops.findOne({
    where: { target: req.params.target },
    order: [
      ['start', 'DESC'],
      ['ttl', 'DESC'],
    ],
  }).then((row) => {
    res.send(row.toJSON());
  }).catch(next);
});

/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  log.error(err);
  res.status(500).send({ err: `${err}` });
});


db.db.sync().then(() => {
  monitor.start();
});

app.listen(config.http.port, config.http.host, () => {
  log.info(`HTTP Server started on http://${config.http.host}:${config.http.port}`);
});
