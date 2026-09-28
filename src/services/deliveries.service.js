const DeliveryRepository = require('../repositories/deliveries.repository');
const OrderRepository = require('../repositories/orders.repository');
const CourierRepository = require('../repositories/couriers.repository');
const { getTrackingStatus } = require('./trackingProvider');
const { DELIVERY_STATUSES } = require('../constants');
const {
  NotFoundError,
  ValidationError,
  InvalidStatusError,
} = require('../errors/app.error');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');

class DeliveryService {
  static async create({ orderId, courierId, status }) {
    if (!orderId || !courierId) {
      throw new ValidationError('Faltan orderId o courierId');
    }

    if (status && !Object.values(DELIVERY_STATUSES).includes(status)) {
      throw new InvalidStatusError('Estado de entrega invalido');
    }

    const order = await OrderRepository.getById(orderId);
    if (!order) {
      throw new NotFoundError('Envio no encontrado');
    }

    const courier = await CourierRepository.getById(courierId);
    if (!courier) {
      throw new NotFoundError('Repartidor no encontrado');
    }

    return DeliveryRepository.create({
      orderId,
      courierId,
      status: status || DELIVERY_STATUSES.ASSIGNED,
      assignedAt: new Date(),
    });
  }

  static async getAll(query) {
    const pagination = parsePagination(query);
    const { data, total } = await DeliveryRepository.getAll(pagination);
    return buildPaginatedResponse(data, total, pagination);
  }

  static async getById(id) {
    const delivery = await DeliveryRepository.getById(id);

    if (!delivery) {
      throw new NotFoundError('Entrega no encontrada');
    }

    return {
      delivery,
      tracking: { status: getTrackingStatus(delivery._id) },
    };
  }

  static async updateStatus(id, status) {
    if (!status) {
      throw new ValidationError('Falta el status');
    }

    if (!Object.values(DELIVERY_STATUSES).includes(status)) {
      throw new InvalidStatusError('Estado de entrega invalido');
    }

    const delivery = await DeliveryRepository.updateStatus(id, status);

    if (!delivery) {
      throw new NotFoundError('Entrega no encontrada');
    }

    return delivery;
  }
}

module.exports = DeliveryService;
