const express = require('express');
const Boom = require('boom');

const apiRouter = require('./routes/api/shops');
require('./model/Shop');

const app = express();

app.get('/', (req, res) => res.json({ message: 'API server is running' }));
app.use('/api/shops', apiRouter);

// 404 handler
app.use((req, res) => {
  const err = Boom.notFound('Not found');
  res.status(404);
  return res.json(err.output);
});

// default error handler
app.use((err, req, res, next) => {
  if (err.isBoom) {
    res.status(err.output.statusCode);
    return res.json(err.output);
  }
  return next(err);
});

module.exports = app;
