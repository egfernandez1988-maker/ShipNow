const ProductService = require('../services/products.service');

class ProductController {
  static async create(req, res, next) {
    try {
      const { name, price, stock, status } = req.body;
      const product = await ProductService.create({ name, price, stock, status });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const products = await ProductService.getAll();

      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const product = await ProductService.getById(req.params.id);

      res.json(product);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
