require('./libs/process-start-end-operation');
require('dotenv').config({
  path: __dirname + '/.env'
});
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');
const minifyHTML = require('./libs/minify-html');
const db = require('./db');
const { initRoot } = require('./libs/get-root');
initRoot(__dirname);

const globalRouter = require('./routes/_global');
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const servicesRouter = require('./routes/services');

const app = express();

app.use(minifyHTML());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: __dirname + '/tmp/files/'
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
app.use(globalRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/services', servicesRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

module.exports = app;