const Order = require('../models/order');

class OrderRepository {
  static async create(orderData) {
    return Order.create(orderData);
  }

  static async getAll() {
    return Order.find();
  }

  static async getById(id) {
    return Order.findById(id);
  }

  static async updateStatus(id, status) {
    return Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  }

  static async addProof(id, proof) {
    return Order.findByIdAndUpdate(
      id,
      { $push: { proofs: proof } },
      { new: true, runValidators: true }
    );
  }
}

module.exports = OrderRepository;
