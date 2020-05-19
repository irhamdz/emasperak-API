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
            let label = 'Emas',
                unit = 'gram',
                priceChangesText,
                priceChanges,
                lastUpdatedDate,
                lastUpdatedDateISO,
                lastPriceText,
                lastPrice
            let data = [];
            $('.antam-chart .chart-info .ci-child').each((i, elem) => {
                // TODO: this code is for get the last price by lastUpdatedDate
                // if (i === 0) {
                //     lastPriceText = $(elem).find('.value').text().replace(/\t|\n/g, '');
                //     lastPrice = parseInt(priceText.slice(2, -3).replace(/[.]/g, ''))
                // }

                if (i === 1) {
                    let plus = $(elem).find('.value').html()
                    let plusCheck = $(plus).hasClass('fa-caret-up')
                    priceChangesText = $(elem).find('.value').text().replace(/\t|\n/g, '');
                    priceChanges = parseInt(priceChangesText.replace(/,/g, '').replace('Rp', ''))

                    // change to minus
                    if (!plusCheck) {
                        priceChanges = -Math.abs(priceChanges);
                        console.log(typeof (priceChanges), priceChanges);
                    }
                }
                if (i === 2) {
                    lastUpdatedDate = $(elem).find('.value').text().replace(/\t|\n/g, '');
                    lastUpdatedDateISO = new Date(`${lastUpdatedDate} UTC`).toISOString();
                }
            })
            $('#purchase .ctr').each((i, elem) => {
                let textElement = $(elem).find('.item-1').html();
                let label = $(textElement).find('.ngc-text').text().replace(/\t|\n/g, '');
                let priceText = $(elem).find('.item-2').text().trim().split(' ')[1];
                data.push({
                    weigth: parseFloat(label.replace(',', '.').match(/[+-]?\d+(\.\d+)?/g)),
                    priceText: `Rp. ${priceText}`,
                    price: parseInt(priceText.replace(/,/g, ''), 10),
                })
            })
            // save to mongodb
            let emas = new EmasPerak({
                label,
                unit,
                lastUpdatedDate,
                lastUpdatedDateISO,
                priceChanges,
                detail: data
            })

            try {
                const newEmas = await emas.save()
                console.log(`success save emas data to db with id ${newEmas._id}`);
            } catch (err) {
                console.log(err);
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}
