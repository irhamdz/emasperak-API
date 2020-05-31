const mongoose = require('mongoose')

const emasperakSchema = new mongoose.Schema({
    label: {type: String, lowercase: true, trim: true, required: true},
    unit: {type: String, required: true},
    lastUpdatedDate: {type: String, required: true},
    lastUpdatedDateISO: {type: Date, required: true},
    priceChanges: {type: Number, required: true},
    location: {type: String},
    detail: {type: Array, "default": []},
})

module.exports = mongoose.model('EmasPerak', emasperakSchema)
