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
const currency = require('./routes/currency');

// scrape
const scrapeEmas = require('./routes/scrapesEmas');
const scrapePerak = require('./routes/scrapesPerak');
const scrapeInflation = require('./routes/scrapeInflation');
const scrapeKurs = require('./routes/scrapeKursDunia')

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
app.use('/currency', currency);

// scrape
app.use('/scrapeEmas', scrapeEmas);
app.use('/scrapePerak', scrapePerak);
app.use('/scrapeInflation', scrapeInflation);
app.use('/scrapeKurs', scrapeKurs);

module.exports = app;
