/* eslint-disable no-console */
const path = require('path');
const config = require('config');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');

const listenPort = config.get('webserver.listenPort');
const app = express();
app.use(morgan('combined'));

app.enable('etag');
app.use(compression());

// Static routes
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/views/index.html`));
});
app.use('/styles/', express.static(path.join(`${__dirname}/styles`)));
app.use('/scripts/', express.static(path.join(`${__dirname}/scripts`)));
app.use('/scripts/vis/', express.static(path.join(`${__dirname}/node_modules/vis/dist/`)));
app.use('/scripts/jquery/', express.static(path.join(`${__dirname}/node_modules/jquery/dist/`)));

const dbInit = require('./db');
const routes = require('./routes/app');

dbInit().then((dbs) => {
  // Initialize the application once database connections are ready.
  routes(app, dbs).listen(listenPort, () => console.log(`Listening on port ${listenPort}`));
}).catch((err) => {
  console.error('Failed to make all database connections!');
  console.error(err);
  process.exit(1);
});
