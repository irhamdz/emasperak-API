const express = require('express');
const router = express.Router();

// Require controller modules.
const currency_controller = require('../controllers/currencyController');

// currency routes
router.get('/', currency_controller.get_currency);
router.post('/', currency_controller.post_currency);
router.patch('/:id', currency_controller.patch_currency);
router.delete('/:id', currency_controller.delete_currency);

module.exports = router
