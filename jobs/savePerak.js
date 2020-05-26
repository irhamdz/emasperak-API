const EmasPerak = require('../models/emasperak')
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async () => {
    console.log('started save perak job ...');
    const url = 'https://www.logammulia.com/';
    await axios.get(url)
        .then(async (response) => {
            let html = response.data;
            let $ = cheerio.load(html);
            let label = 'Perak',
                unit = 'gram',
                weight = 1,
                priceChangesText,
                priceChanges,
                lastUpdatedDate,
                lastUpdatedDateISO,
                lastPriceText,
                lastPrice
            let data = [];
            $('.hero-price .child').each((i, elem) => {
                if (i === 0) {
                    lastUpdatedDate = $(elem).find('p').text().replace(/\t|\n/g, '').slice(20);
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
                            priceChanges = parseInt($(elem).text().replace(/\t|\n/g, '').slice(2));
                            if (!$(pluscheck).hasClass('fa-caret-up')) {
                                priceChanges = -Math.abs(priceChanges);
                            }
                        }
                    });
                }
            })

            let perak = new EmasPerak({
                label,
                unit,
                lastUpdatedDate,
                lastUpdatedDateISO,
                priceChanges,
                detail: data
            })

            const newPerak = await perak.save()
            console.log(`success save perak data to db with id ${newPerak._id}`);

            // try {
            //     const newPerak = await perak.save()
            //     console.log(`success save perak data to db with id ${newPerak._id}`);
            // } catch (err) {
            //     let errorJson = err.toJSON()
            //     let errorResponse = {
            //         status: 'error',
            //         code: errorJson.code,
            //         message: `error scrape perak - ${errorJson.message}`
            //     }
            //     console.log(errorResponse);
            // }
        }).catch(function (error) {
        // handle error
        let errorJson = error.toJSON()
        let errorResponse = {
            status: 'error',
            code: errorJson.code,
            message: `error scrape perak - ${errorJson.message}`
        }
        console.log(errorResponse);
    });
}
