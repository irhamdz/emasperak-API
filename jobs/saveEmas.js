const EmasPerak = require('../models/emasperak')
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async () => {
    console.log('started job save emas ...');
    let url = 'https://www.logammulia.com/id/purchase/gold';

    axios.get(url)
        .then(async (response) => {
            let html = response.data;
            let $ = cheerio.load(html);
            let date, dateISO, priceChangesText, priceChanges, unit = 'gram', weight = 1, priceText, price;
            // let data = [];
            $('.antam-chart .chart-info .ci-child').each((i, elem) => {
                if (i === 0) {
                    priceText = $(elem).find('.value').text().replace(/\t|\n/g, '');
                    price = parseInt(priceText.slice(2, -3).replace(/[.]/g, ''))
                }

                if (i === 1) {
                    let plus = $(elem).find('.value').html()
                    let plusCheck = $(plus).hasClass('fa-caret-up')
                    priceChangesText = $(elem).find('.value').text().replace(/\t|\n/g, '');
                    priceChanges = parseInt(priceChangesText.replace(/,/g, '').slice(2))

                    // change to minus
                    if (!plusCheck) {
                        priceChanges = -priceChanges
                    }
                }
                if (i === 2) {
                    date = $(elem).find('.value').text().replace(/\t|\n/g, '');
                    dateISO = new Date(`${date} UTC`).toISOString();
                }
            });

            // save to mongodb
            const emas = new EmasPerak({
                date,
                dateISO,
                priceChangesText,
                priceChanges,
                unit,
                weight,
                priceText,
                price
            })

            try {
                const newEmas = await emas.save()
                console.log(`success save to db with id ${newEmas._id}`);
            } catch (err) {
                console.log(err);
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}
