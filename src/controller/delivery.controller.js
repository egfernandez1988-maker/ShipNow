const DeliveryService = require('../services/deliveries.service');

class DeliveryController {
  static async create(req, res, next) {
    try {
      const delivery = await DeliveryService.create(req.body);
      res.status(201).json(delivery);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const deliveries = await DeliveryService.getAll();
      res.status(200).json(deliveries);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const delivery = await DeliveryService.getById(req.params.id);
      res.status(200).json(delivery);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const delivery = await DeliveryService.updateStatus(req.params.id, req.body.status);
      res.status(200).json(delivery);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DeliveryController;
