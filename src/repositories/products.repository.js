const Product = require('../models/product');

class ProductRepository {
  static async create(productData) {
    return Product.create(productData);
  }

  static async getAll() {
    return Product.find();
  }

  static async getById(id) {
    return Product.findById(id);
  }
}

module.exports = ProductRepository;
