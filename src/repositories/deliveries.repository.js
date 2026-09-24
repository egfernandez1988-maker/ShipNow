const Delivery = require('../models/delivery');

class DeliveryRepository {
  static async create(deliveryData) {
    return Delivery.create(deliveryData);
  }

  static async getAll() {
    return Delivery.find();
  }

  static async getById(id) {
    return Delivery.findById(id);
  }

  static async updateStatus(id, status) {
    return Delivery.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  }
}

module.exports = DeliveryRepository;
