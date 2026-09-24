const CourierRepository = require('../repositories/couriers.repository');
const { NotFoundError, ValidationError } = require('../errors/app.error');

class CourierService {
  static async create({ name, zone, available }) {
    if (!name || !zone) {
      throw new ValidationError('Faltan datos obligatorios del repartidor');
    }

    if (available !== undefined && typeof available !== 'boolean') {
      throw new ValidationError('La disponibilidad debe ser un valor booleano');
    }

    return CourierRepository.create({
      name,
      zone,
      available: available !== undefined ? available : true,
    });
  }

  static async getAll() {
    return CourierRepository.getAll();
  }

  static async getById(id) {
    const courier = await CourierRepository.getById(id);

    if (!courier) {
      throw new NotFoundError('Repartidor no encontrado');
    }

    return courier;
  }
}

module.exports = CourierService;
