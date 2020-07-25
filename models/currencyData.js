const mongoose = require('mongoose')
const Currency = mongoose.model('Currency');

const currencyDataSchema = new mongoose.Schema({
    _currency: {type: mongoose.Schema.Types.ObjectId, ref: 'Currency'},
    value: {type: Number, required: true},
    sell: {type: Number, required: true},
    buy: {type: Number, required: true},
    lastUpdatedDateISO: {type: Date},
})

currencyDataSchema.statics.findByCode = function (code, callback) {
    let query = this.find()

    Currency.find({'code': code}, function (error, currency) {
        console.log(currency)
        query.where(
            {_currency: mongoose.Types.ObjectId(currency._id)}
        ).exec(callback);
    })
    return query
}
exports.CurrencyData = mongoose.model('CurrencyData', currencyDataSchema);
