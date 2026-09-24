const CourierService = require('../services/couriers.service');

class CourierController {
  static async create(req, res, next) {
    try {
      const courier = await CourierService.create(req.body);
      res.status(201).json(courier);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const couriers = await CourierService.getAll();
      res.status(200).json(couriers);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const courier = await CourierService.getById(req.params.id);
      res.status(200).json(courier);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CourierController;
