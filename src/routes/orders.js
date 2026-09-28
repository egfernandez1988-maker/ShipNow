const express = require('express');
const OrderController = require('../controller/order.controller');
const UploadsController = require('../controller/uploads.controller');
const upload = require('../config/upload.config');

const router = express.Router();

router.post('/', OrderController.create);
router.get('/', OrderController.getAll);
router.get('/:id', OrderController.getById);
router.patch('/:id/status', OrderController.updateStatus);
router.post('/:id/proofs', upload.single('proof'), UploadsController.addOrderProof);

module.exports = router;
