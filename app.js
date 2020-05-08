'use strict'

const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const verifyToken = require('./lib/verifyToken');

//Initialization
const app = express();
//conect to db
require('./lib/connectMongoose');


// settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);


app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


// Internationalization
const i18n = require('./lib/i18nConfigure')();
app.use(i18n.init);


/**
 * Routes API
 */
app.use('/apiv1/authenticate', require('./routes/apiv1/authenticate'));
app.use('/apiv1', verifyToken, require('./routes/apiv1/items'));


/**
 * Routes website
 */
app.use('/', require('./routes/index'));
app.use('/change-locale', require('./routes/change-locale'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.locals.error = req.app.get("env") === "development" ? err : {};

  const msg = err.message;
  err.message = [msg];

  if (err.errors) {
    res.status(err.status || 422);
    err.status ? err.status = err.status : err.status = 422;
    const messageError = err.array().map(item => {
      return item.msg;
    });
    err.message = messageError;
  }

  if (isAPIRequest(req)) {
    if (err.errors) {
      const errors = err.array();
      res.status = err.status;

      const messagesErrors = errors.map(item => {
        return { param: item.param, error: item.msg };
      });

      res.json({ errors: messagesErrors });
      return;
    } else {
      res.status(err.status || 404);
      res.json({ errors: err });
    }
  }

  // render the error page
  res.render("error");
});

function isAPIRequest(req) {
  return req.originalUrl.startsWith("/apiv1");
}


module.exports = app;