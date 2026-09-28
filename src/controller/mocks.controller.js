const MocksService = require('../services/mocks.service');

class MocksController {
  static getAll(req, res, next) {
    try {
      const mocks = MocksService.generate(req.query.quantity);
      res.status(200).json(mocks);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MocksController;
