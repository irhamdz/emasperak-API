const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDb = require('./config/db')
const cron = require('node-cron');
const EmasJob = require('./jobs/saveEmas')
const savePerakJob = require('./jobs/savePerak')
const dotenv = require('dotenv');
const colors = require('colors')

dotenv.config()

connectDb();

// schedule cron jobs
const task = cron.schedule("5 * * * *", function () {
    EmasJob.saveEmas();
    savePerakJob();
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const emasRouter = require('./routes/emas');
const perakRouter = require('./routes/perak');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/emas', emasRouter);
app.use('/perak', perakRouter);

module.exports = app;
