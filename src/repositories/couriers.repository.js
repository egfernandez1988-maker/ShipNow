const Courier = require('../models/courier');

class CourierRepository {
  static async create(courierData) {
    return Courier.create(courierData);
  }

  static async getAll({ skip, limit }) {
    const [data, total] = await Promise.all([Courier.find().skip(skip).limit(limit), Courier.countDocuments()]);
    return { data, total };
  }

  static async getById(id) {
    return Courier.findById(id);
  }
}

module.exports = CourierRepository;
