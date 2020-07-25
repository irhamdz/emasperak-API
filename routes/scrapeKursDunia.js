const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const {Currency} = require('../models/currency')
const {CurrencyData} = require('../models/currencyData')

/* scrapes kurs data and save to mongodb. */
router.get('/', async (req, res) => {
    let url = 'https://www.bi.go.id/id/moneter/informasi-kurs/transaksi-bi/'

    await axios.get(url)
        .then(async response => {
            let html = response.data;
            let $ = cheerio.load(html);
            let box = $('.box_gray').html()
            let insertedDocs = [];
            let currencyDataObj = {
                '_currency': '',
                'value': '',
                'sell': '',
                'buy': '',
                'lastUpdatedDateISO': '',
            }
            let updatedDateString = $(box).find('.floatR').text().trim()
            let indexDigit = updatedDateString.search(/\d/)
            let lastUpdatedDateISO = new Date(`${updatedDateString.slice(indexDigit)} UTC`).toISOString();
            let currency = await $(box).find('.table1 > tbody > tr').slice(1, 26).each(async (i, elem) => {
                let arrayData = [];
                $(elem).find('td').slice(0, 4).each((i, elem) => {
                    arrayData.push($(elem).text().trim())
                })

                // get currency ref id
                Currency.findOne({code: arrayData[0]}).exec(async (err, currency) => {
                    if (err) return res.status(500).json({message: err.message})
                    if (currency) {
                        currencyDataObj._currency = currency._id
                        currencyDataObj.value = parseFloat(arrayData[1])
                        currencyDataObj.sell = parseFloat(arrayData[2].replace(/[,]/g, ''))
                        currencyDataObj.buy = parseFloat(arrayData[3].replace(/[,]/g, ''))
                        currencyDataObj.lastUpdatedDateISO = lastUpdatedDateISO
                        insertedDocs.push(currencyDataObj)

                        let currencyData = new CurrencyData(currencyDataObj);
                        //
                        const newCurrencyData = await currencyData.save();
                        // Currency.currencyData.push(newCurrencyData._id);
                        // Currency.save();
                        console.log(newCurrencyData)
                    } else {
                        console.log('dont have an id', arrayData[0])
                    }
                })
            })

            let successResponse = {
                status: 'success',
                message: `success save kurs data to db`
            }
            res.json(successResponse);
        })
});

module.exports = router;
