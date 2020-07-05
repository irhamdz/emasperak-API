const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const EmasPerak = require('../models/emasperak')

/* scrapes emas data and save to mongodb. */
router.get('/', async (req, res) => {
    console.log('started save emas job ...');
    let url = 'https://www.logammulia.com/id/purchase/gold';

    await axios.get(url)
        .then(async (response) => {
            let html = response.data;
            let $ = cheerio.load(html);
            let label = 'Emas',
                unit = 'gram',
                priceChangesText = '',
                priceChanges = 0,
                lastUpdatedDate = '',
                lastUpdatedDateISO = '',
                location = '',
                data = [];
            $('.antam-chart .chart-info .ci-child').each((i, elem) => {
                // TODO: this code is for get the last price by lastUpdatedDate
                // if (i === 0) {
                //     lastPriceText = $(elem).find('.value').text().replace(/\t|\n/g, '');
                //     lastPrice = parseInt(priceText.slice(2, -3).replace(/[.]/g, ''))
                // }

                if (i === 1) {
                    let plus = $(elem).find('.value').html()
                    let plusCheck = $(plus).hasClass('fa-caret-up')
                    priceChangesText = $(elem).find('.value').text().replace(/[\t\n]/g, '');
                    priceChanges = parseInt(priceChangesText.replace(/,/g, '').replace('Rp', ''))

                    // change to minus
                    if (!plusCheck) {
                        if (Math.abs(priceChanges) !== 0) {
                            priceChanges = -Math.abs(priceChanges);
                        }
                    }
                }
                if (i === 2) {
                    lastUpdatedDate = $(elem).find('.value').text().replace(/[\t\n]/g, '');
                    lastUpdatedDateISO = new Date(`${lastUpdatedDate} UTC`).toISOString();
                }
            })
            $('#purchase .ctr').each((i, elem) => {
                let textElement = $(elem).find('.item-1').html();
                let label = $(textElement).find('.ngc-text').text().replace(/\t|\n/g, '');
                let elementPrice = $(elem).find('.item-2').text().trim()
                let priceTextIndex = elementPrice.search('Rp');
                let priceText = elementPrice.slice(priceTextIndex).split(' ')[1]
                data.push({
                    weigth: parseFloat(label.replace(',', '.').match(/[+-]?\d+(\.\d+)?/g)),
                    priceText: `Rp. ${priceText}`,
                    price: parseInt(priceText.replace(/,/g, ''), 10),
                })
            })

            location = $('.quick-change-location .text').text().toLowerCase();
            let jakarta = ['pulo gadung', 'gedung antam', 'menara ravindo', 'mall ambasador'];
            if (new RegExp(jakarta.join("|")).test(location)) {
                location = `${location}, jakarta`
            }

            // save to mongodb
            let emas = new EmasPerak({
                label,
                unit,
                lastUpdatedDate,
                lastUpdatedDateISO,
                priceChanges,
                location,
                detail: data
            })

            if (isNaN(emas.detail[0].price)) {
                let errorResponse = {
                    status: 'error',
                    code: error.code | 500,
                    message: `error scrape emas , message : price error`
                }
                console.log(errorResponse);
                res.status(500).send(errorResponse);
            } else {
                const newEmas = await emas.save()
                let successResponse = {
                    status: 'success',
                    message: `success save emas data to db with id ${newEmas._id}`
                }
                console.info(successResponse.message);
                res.json(successResponse);
            }
        })
        .catch(function (error) {
            // handle error
            let errorResponse = {
                status: 'error',
                code: error.code | 500,
                message: `error scrape emas - ${error.message}`
            }
            console.log(errorResponse);
            res.status(500).send(errorResponse);
        })
});

/* scrapes emas data and save to mongodb. */
router.get('/buyback', async (req, res) => {
    console.log('started save emas buyback job ...');
    let url = 'https://www.logammulia.com/id/sell/gold';

    await axios.get(url)
        .then(async (response) => {
            let html = response.data;
            let $ = cheerio.load(html);
            let label = 'Emas Buyback',
                unit = 'gram',
                priceChangesText = '',
                priceChanges = 0,
                lastUpdatedDate = '',
                lastUpdatedDateISO = '',
                location = '',
                weight = 1,
                data = [];
            $('.antam-chart .chart-info .ci-child').each((i, elem) => {
                if (i === 0) {
                    let lastPriceText = $(elem).find('.value').text().replace(/\s/g, '').slice(2);
                    let lastPrice = parseInt(lastPriceText.replace(/[,]/g, ''))
                    data.push({
                        weigth: weight,
                        priceText: `Rp. ${lastPriceText}`,
                        price: lastPrice
                    })
                }

                if (i === 1) {
                    let plus = $(elem).find('.value .fa-wrapper').html()
                    let plusCheck = $(plus).hasClass('fa-caret-up')
                    priceChangesText = $(elem).find('.value').text().replace(/[\t\n]/g, '');
                    priceChanges = parseInt(priceChangesText.replace(/,/g, '').replace('Rp', ''));

                    // change to minus
                    if (!plusCheck) {
                        priceChanges = -Math.abs(priceChanges);
                    }
                }
                if (i === 2) {
                    lastUpdatedDate = $(elem).find('.value').text().replace(/^\s+|\s+$/g, '');
                    lastUpdatedDateISO = new Date(`${lastUpdatedDate} UTC`).toISOString();
                }

                if (i === 3) {
                    location = $(elem).find('.value .text').text().toLowerCase();
                    let jakarta = ['pulo gadung', 'gedung antam', 'menara ravindo', 'mall ambasador'];
                    if (new RegExp(jakarta.join("|")).test(location)) {
                        location = `${location}, jakarta`
                    }
                }
            });

            // save to mongodb
            let emasBuyback = new EmasPerak({
                label,
                unit,
                lastUpdatedDate,
                lastUpdatedDateISO,
                priceChanges,
                location,
                detail: data
            })

            const newEmasBuyback = await emasBuyback.save()
            let successResponse = {
                status: 'success',
                message: `success save emas buyback data to db with id ${newEmasBuyback._id}`
            }
            console.info(successResponse.message);
            res.json(successResponse);
        }).catch(error => {
            let errorResponse = {
                status: 'error',
                code: error.code | 500,
                message: `error scrape emas buyback - ${error.message}`
            }
            console.log(errorResponse);
            res.status(500).send(errorResponse);

        })
});

module.exports = router;
