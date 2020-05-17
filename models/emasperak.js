const mongoose = require('mongoose')

const emasperakSchema = new mongoose.Schema({
    date: {type: String, required: true},
    dateISO: {type: Date, required: true},
    priceChangesText: {type: String, required: true},
    priceChanges: {type: Number, required: true},
    unit: {type: String, required: true},
    weight: {type: Number, required: true},
    priceText: {type: String, required: true},
    price: {type: Number, required: true},
})

module.exports = mongoose.model('EmasPerak', emasperakSchema)
