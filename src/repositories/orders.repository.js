const Order = require('../models/order');

class OrderRepository {
  static async create(orderData) {
    return Order.create(orderData);
  }

  static async getAll({ skip, limit }) {
    const [data, total] = await Promise.all([Order.find().skip(skip).limit(limit), Order.countDocuments()]);
    return { data, total };
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
