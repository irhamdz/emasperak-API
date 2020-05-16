var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    let date = req.query.date;
    let sign = req.query.sign;
    let url = 'https://www.astrology.com/horoscope/daily/' + date + '/' + sign + '.html';

    res.send('ini emas');
});

module.exports = router;
