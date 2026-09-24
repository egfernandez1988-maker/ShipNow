const express = require('express');
const DeliveryController = require('../controller/delivery.controller');

const router = express.Router();

router.post('/', DeliveryController.create);
router.get('/', DeliveryController.getAll);
router.get('/:id', DeliveryController.getById);
router.patch('/:id/status', DeliveryController.updateStatus);

module.exports = router;
