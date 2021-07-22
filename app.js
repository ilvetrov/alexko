"use strict";
require('./libs/process-start-end-operation');
require('dotenv').config({
  path: __dirname + '/.env'
});

const { initRoot } = require('./libs/get-root');
initRoot(__dirname);

const isDevelopment = require('./libs/is-development');
const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');
const minifyHTML = require('./libs/minify-html');
const db = require('./db');

const routes = require('./routes');

const app = express();

app.use(minifyHTML());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: __dirname + '/tmp/files/'
}));

app.use(cors({
  origin: !isDevelopment ? [
    'https://alexko.ltd',
    /\.alexko\.ltd$/,
  ] : '*'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', {
  layout: 'layouts/front'
});
hbs.registerPartials(__dirname + '/views/partials');
require('./hbs-helpers');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

require('./libs/empty-tmp');

require('./demo-domains');

require('./libs/get-metrics-for-manual-installation');

const { langConstructor } = require('./libs/user-language');
const defaultResLocals = require('./libs/default-res-locals');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  defaultResLocals(req, res);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.showError = req.app.get('env') === 'development';

  const lang = langConstructor(req);
  // render the error page
  res.status(err.status || 500);
  res.renderMin('pages/error', {
    title: lang('page_not_found') + ' – AlexKo',
    layout: 'layouts/mini',
    links: Array.from(lang('404_links')).map(link => {
      return {...link, ...{
        url: (link.url === '/' ? res.locals.linkPrefixOfHome : res.locals.linkPrefix) + link.url
      }};
    })
  });
});

module.exports = app;