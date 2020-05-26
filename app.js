const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors')
const connectDb = require('./config/db')

dotenv.config()

connectDb();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const emasRouter = require('./routes/emas');
const perakRouter = require('./routes/perak');
const scrapeEmas = require('./routes/scrapesEmas');
const scrapePerak = require('./routes/scrapesPerak');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/emas', emasRouter);
app.use('/api/perak', perakRouter);
app.use('/api/scrapeEmas', scrapeEmas);
app.use('/api/scrapePerak', scrapePerak);

module.exports = app;
