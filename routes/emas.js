const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const EmasPerak = require('../models/emasperak')

/* GET emas listing. */
router.get('/', async (req, res, next) => {
    try {
        const result = await EmasPerak.findOne().sort('-_id');
        res.json(result);
    } catch (err) {
        res.status(500).json({message: err.message})
    }
    // handle success
    // let url = 'https://www.logammulia.com/id/purchase/gold';
    //
    // axios.get(url)
    //     .then(function (response) {
    //         let html = response.data;
    //         let $ = cheerio.load(html);
    //         let priceChangesText;
    //         let priceChanges;
    //         let date;
    //         let dateISO;
    //         let data = [];
    //         $('.antam-chart .chart-info .ci-child').each((i, elem) => {
    //             if (i === 1) {
    //                 let plus = $(elem).find('.value').html()
    //                 let plusCheck = $(plus).hasClass('fa-caret-up')
    //                 priceChangesText = $(elem).find('.value').text().replace(/\t|\n/g, '');
    //                 priceChanges = parseInt(priceChangesText.replace(/,/g, '').replace('Rp', ''))
    //
    //                 // change to minus
    //                 if (!plusCheck) {
    //                     priceChanges = -priceChanges
    //                 }
    //             }
    //             if (i === 2) {
    //                 date = $(elem).find('.value').text().replace(/\t|\n/g, '');
    //                 dateISO = new Date(`${date} UTC`).toISOString();
    //             }
    //         })
    //         $('#purchase .ctr').each((i, elem) => {
    //             let textElement = $(elem).find('.item-1').html();
    //             let label = $(textElement).find('.ngc-text').text().replace(/\t|\n/g, '');
    //             let priceText = $(elem).find('.item-2').text().trim().split(' ')[1];
    //             data.push({
    //                 weigth: parseFloat(label.replace(',', '.').match(/[+-]?\d+(\.\d+)?/g)),
    //                 priceText: `Rp. ${priceText}`,
    //                 price: parseInt(priceText.replace(/,/g, ''), 10),
    //             })
    //         })
    //
    //         let resp = {
    //             date,
    //             dateISO,
    //             priceChangesText,
    //             priceChanges,
    //             unit: 'gram',
    //             data
    //         }
    //         res.send(resp);
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     })
});

module.exports = router;
