const Product = require('../models/product');

class ProductRepository {
  static async create(productData) {
    return Product.create(productData);
  }

  static async getAll({ skip, limit, filter = {} }) {
    const [data, total] = await Promise.all([Product.find(filter).skip(skip).limit(limit), Product.countDocuments(filter)]);
    return { data, total };
  }

  static async getById(id) {
    return Product.findById(id);
  }
}

module.exports = ProductRepository;
