const UploadsService = require('../services/uploads.service');

class UploadsController {
  static async addUserDocument(req, res, next) {
    try {
      const user = await UploadsService.addUserDocument(req.params.id, req.file);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async addOrderProof(req, res, next) {
    try {
      const order = await UploadsService.addOrderProof(req.params.id, req.file);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  static async addDeliveryProof(req, res, next) {
    try {
      const delivery = await UploadsService.addDeliveryProof(req.params.id, req.file);
      res.status(200).json(delivery);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UploadsController;
