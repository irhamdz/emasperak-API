const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const EmasPerak = require('../models/emasperak')

/* scrapes emas data and save to mongodb. */
router.get('/', async (req, res) => {
    console.log('started save perak job ...');
    const url = 'https://www.logammulia.com/';
    await axios.get(url)
        .then(async (response) => {
            let html = response.data;
            let $ = cheerio.load(html);
            let label = 'Perak',
                unit = 'gram',
                weight = 1,
                priceChanges = 0,
                lastUpdatedDate = '',
                lastUpdatedDateISO = '',
                location = '',
                data = [];
            $('.hero-price .child').each((i, elem) => {
                if (i === 0) {
                    lastUpdatedDate = $(elem).find('p').text().replace(/[\t\n]/g, '').slice(20);
                    lastUpdatedDateISO = new Date(`${lastUpdatedDate} UTC`).toISOString();
                }

                if (i === 2) {
                    $(elem).find('.price span').each((i, elem) => {
                        if (i === 0) {
                            let priceText = $(elem).text().split(' ')[1]
                            data.push({
                                weight: weight,
                                priceText: priceText,
                                price: parseInt(priceText.slice(2, -3).replace(/[.]/g, ''), 10),
                            })

                        }
                        let pluscheck = $(elem).html()
                        if (i === 1) {
                            priceChanges = parseInt($(elem).text().replace(/[\t\n]/g, '').slice(2));
                            if (!$(pluscheck).hasClass('fa-caret-up')) {
                                priceChanges = -Math.abs(priceChanges);
                            }
                        }
                    });
                }

                if (i === 3) {
                    location = $(elem).find('p .text').text().toLowerCase();
                    let jakarta = ['pulo gadung', 'gedung antam', 'menara ravindo', 'mall ambasador'];
                    if (new RegExp(jakarta.join("|")).test(location)) {
                        location = `${location}, jakarta`
                    }
                }
            })

            let perak = new EmasPerak({
                label,
                unit,
                lastUpdatedDate,
                lastUpdatedDateISO,
                priceChanges,
                location,
                detail: data
            })

            const newPerak = await perak.save()
            let successResponse = {
                status: 'success',
                message: `success save perak data to db with id ${newPerak._id}`
            }
            console.log(successResponse.message);
            res.json(successResponse);
        }).catch(function (error) {
            // handle error
            let errorResponse = {
                status: 'error',
                code: error.code | 500,
                message: `error scrape perak - ${error.message}`
            }
            console.log(errorResponse);
            res.status(500).send(errorResponse);
        });
});

module.exports = router;
