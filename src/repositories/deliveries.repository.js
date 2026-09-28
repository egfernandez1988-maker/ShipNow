const Delivery = require('../models/delivery');

class DeliveryRepository {
  static async create(deliveryData) {
    return Delivery.create(deliveryData);
  }

  static async getAll({ skip, limit }) {
    const [data, total] = await Promise.all([Delivery.find().skip(skip).limit(limit), Delivery.countDocuments()]);
    return { data, total };
  }

  static async getById(id) {
    return Delivery.findById(id);
  }

  static async updateStatus(id, status) {
    return Delivery.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  }

  static async addProof(id, proof) {
    return Delivery.findByIdAndUpdate(
      id,
      { $push: { proofs: proof } },
      { new: true, runValidators: true }
    );
  }
}

module.exports = DeliveryRepository;
