const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

/* GET users listing. */
router.get('/', (req, res, next) => {
    // handle success
    let url = 'https://www.logammulia.com/id/purchase/gold';

    axios.get(url)
        .then(function (response) {
            let html = response.data;
            let $ = cheerio.load(html);
            let priceChangesText;
            let priceChanges;
            let dateChanges;
            let data = [];
            $('.antam-chart .chart-info .ci-child').each((i, elem) => {
                if (i === 1) {
                    let plus = $(elem).find('.value').html()
                    let plusCheck = $(plus).hasClass('fa-caret-up')
                    priceChangesText = $(elem).find('.value').text().replace(/\t|\n/g, '');
                    priceChanges = parseInt(priceChangesText.replace(/,/g, '').replace('Rp', ''))

                    // change to minus
                    if (!plusCheck) {
                        priceChanges = -priceChanges
                    }
                }
                if (i === 2) {
                    dateChanges = $(elem).find('.value').text().replace(/\t|\n/g, '');
                }
            })
            $('#purchase .ctr').each((i, elem) => {
                let textElement = $(elem).find('.item-1').html();
                let label = $(textElement).find('.ngc-text').text().replace(/\t|\n/g, '');
                let priceText = $(elem).find('.item-2').text().trim().split(' ')[1];
                data.push({
                    weigth: label.replace('Hanya di Butik LM', ''),
                    priceText: `Rp. ${priceText}`,
                    price: parseInt(priceText.replace(/,/g, ''), 10)
                })
            })

            let resp = {
                dateChanges,
                priceChangesText,
                priceChanges,
                data
            }
            res.send(resp);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
});

module.exports = router;
