const mongoose = require('mongoose')
const {Currency} = require('../models/currency')
const {CurrencyData} = require('../models/currencyData')

exports.get_currency = function (req, res) {
    const filter = {};
    // CurrencyData.findByCode('USD', function (err, currencyData) {
    //     if (err) return res.send(err);
    //
    //     res.json(currencyData);
    // }).populate('_currency');

    CurrencyData.find({_currency: mongoose.Types.ObjectId('5f014aa6c1bad657ac80b3ca')}).populate('_currency').exec((error, currency) => {
        if (error) return res.status(500).json({message: error.message})
        console.log(currency)
        res.json(currency)
    })
}

exports.get_currency_detail = function (req, res) {
    res.send('NOT IMPLEMENTED: currency detail' + req.params.id);
}

exports.post_currency = function (req, res) {
    res.send('NOT IMPLEMENTED: currency create');
}

exports.patch_currency = function (req, res) {
    res.send('NOT IMPLEMENTED: currency patch' + req.params.id);
}

exports.delete_currency = function (req, res) {
    res.send('NOT IMPLEMENTED: currency delete' + req.params.id);
}
