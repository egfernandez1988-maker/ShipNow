const express = require('express');
const LoggerController = require('../controller/logger.controller');

const router = express.Router();

router.get('/test', LoggerController.test);

module.exports = router;
