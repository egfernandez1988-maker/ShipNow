const LoggerService = require('../services/logger.service');

class LoggerController {
  static test(req, res, next) {
    try {
      res.status(200).json(LoggerService.runTest());
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LoggerController;
