const mongoose = require('mongoose')

const emasperakSchema = new mongoose.Schema({
    title: {type: String, lowercase: true, trim: true, required: true},
    unit: {type: String, required: true},
    lastUpdatedDate: {type: String, required: true},
    lastUpdatedDateISO: {type: Date, required: true},
    priceChanges: {type: Number, required: true},
    detail: {type: Array, "default": []},
})

module.exports = mongoose.model('EmasPerak', emasperakSchema)
