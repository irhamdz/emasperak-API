const mongoose = require('mongoose')

const currencySchema = new mongoose.Schema({
    code: {type: String, uppercase: true, required: true, unique: true, dropDups: true},
    symbol: {type: String, required: true},
    digitalCode: {type: Number, required: true},
    name: {type: String, required: true},
    country: {type: String, required: true},
    // currencyData: [{type: mongoose.Schema.Types.ObjectId, ref: 'CurrencyData'}]
})

exports.Currency = mongoose.model('Currency', currencySchema);
