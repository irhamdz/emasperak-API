const express = require('express');
const router = express.Router();
const EmasPerak = require('../models/emasperak')

/* GET emas listing. */
router.get('/', async (req, res, next) => {
    try {
        //GET latest inserted document with label = 'emas';
        const result = await EmasPerak.findOne({label: 'emas'}, '-_id -__v').sort('-_id')
        res.json(result);
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

module.exports = router;
