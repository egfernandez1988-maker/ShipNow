const OrderRepository = require('../repositories/orders.repository');
const sendNotification = require('./notifications');
const { ORDER_STATUSES, ORDER_PRIORITIES } = require('../constants');
const {
  NotFoundError,
  ValidationError,
  InvalidStatusError,
} = require('../errors/app.error');

class OrderService {
  static async create({ customerName, customer, address, weight, courierId, items, priority }) {
    if (!customerName || !address || weight === undefined) {
      throw new ValidationError('Faltan datos obligatorios del envio');
    }

    if (typeof weight !== 'number' || weight <= 0) {
      throw new ValidationError('El peso debe ser un numero mayor a 0');
    }

    if (priority && !Object.values(ORDER_PRIORITIES).includes(priority)) {
      throw new ValidationError('Prioridad de envio invalida');
    }

    const cost = OrderService.calculateShippingCost(weight);
    const order = await OrderRepository.create({
      customerName,
      customer: customer || null,
      address,
      weight,
      cost,
      status: ORDER_STATUSES.PENDING,
      priority: priority || ORDER_PRIORITIES.NORMAL,
      items: items || [],
      courierId: courierId || null,
    });

    sendNotification(`Nuevo envio creado para ${customerName} por $${cost}`);
    return order;
  }

  static async getAll() {
    return OrderRepository.getAll();
  }

  static async getById(id) {
    const order = await OrderRepository.getById(id);

    if (!order) {
      throw new NotFoundError('Envio no encontrado');
    }

    return order;
  }

  static async updateStatus(id, status) {
    if (!status) {
      throw new ValidationError('Falta el status');
    }

    if (!Object.values(ORDER_STATUSES).includes(status)) {
      throw new InvalidStatusError('Estado de envio invalido');
    }

    const order = await OrderRepository.updateStatus(id, status);

    if (!order) {
      throw new NotFoundError('Envio no encontrado');
    }

    return order;
  }

  static calculateShippingCost(weight) {
    return weight * 10;
  }
}

module.exports = OrderService;
