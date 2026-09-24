const OrderService = require('../services/orders.service');

class OrderController {
  static async create(req, res, next) {
    try {
      const order = await OrderService.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const orders = await OrderService.getAll();
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const order = await OrderService.getById(req.params.id);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const order = await OrderService.updateStatus(req.params.id, req.body.status);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
