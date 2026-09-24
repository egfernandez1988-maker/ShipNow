const Courier = require('../models/courier');

class CourierRepository {
  static async create(courierData) {
    return Courier.create(courierData);
  }

  static async getAll() {
    return Courier.find();
  }

  static async getById(id) {
    return Courier.findById(id);
  }
}

module.exports = CourierRepository;
