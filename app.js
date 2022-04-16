var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const riderRouter = require('./routes/rider');
const driverRouter = require('./routes/driver');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/rider', riderRouter);
app.use('/driver', driverRouter);

module.exports = app;