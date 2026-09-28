const express = require('express');
const DeliveryController = require('../controller/delivery.controller');
const UploadsController = require('../controller/uploads.controller');
const upload = require('../config/upload.config');

const router = express.Router();

router.post('/', DeliveryController.create);
router.get('/', DeliveryController.getAll);
router.get('/:id', DeliveryController.getById);
router.patch('/:id/status', DeliveryController.updateStatus);
router.post('/:id/proofs', upload.single('proof'), UploadsController.addDeliveryProof);

module.exports = router;
