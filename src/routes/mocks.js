const express = require('express');
const MocksController = require('../controller/mocks.controller');

const router = express.Router();

router.get('/', MocksController.getAll);

module.exports = router;
