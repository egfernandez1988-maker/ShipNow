const { Types } = require('mongoose');
const {
  USER_ROLES,
  PRODUCT_STATUSES,
  ORDER_STATUSES,
  ORDER_PRIORITIES,
  DELIVERY_STATUSES,
  MOCK_LIMITS,
} = require('../constants');
const { InvalidMockQuantityError } = require('../errors/app.error');
const logger = require('../config/logger.config');

class MocksService {
  static generate(quantity = MOCK_LIMITS.DEFAULT_QUANTITY) {
    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity)
      || parsedQuantity < 1
      || parsedQuantity > MOCK_LIMITS.MAX_QUANTITY
    ) {
      throw new InvalidMockQuantityError(
        `La cantidad de mocks debe ser un entero entre 1 y ${MOCK_LIMITS.MAX_QUANTITY}`
      );
    }

    const users = Array.from({ length: parsedQuantity }, (_, index) => MocksService.createUser(index));
    const products = Array.from({ length: parsedQuantity }, (_, index) => MocksService.createProduct(index));
    const couriers = Array.from({ length: parsedQuantity }, (_, index) => MocksService.createCourier(index));
    const orders = Array.from(
      { length: parsedQuantity },
      (_, index) => MocksService.createOrder(index, users[index], couriers[index])
    );
    const deliveries = Array.from(
      { length: parsedQuantity },
      (_, index) => MocksService.createDelivery(orders[index], couriers[index])
    );

    logger.info('Mocks generados', { quantity: parsedQuantity });

    return { users, products, couriers, orders, deliveries };
  }

  static createUser(index) {
    return {
      _id: new Types.ObjectId().toString(),
      name: `Usuario Mock ${index + 1}`,
      email: `usuario.mock${index + 1}@shipnow.test`,
      role: USER_ROLES.USER,
    };
  }

  static createProduct(index) {
    const stock = index + 1;

    return {
      _id: new Types.ObjectId().toString(),
      name: `Producto Mock ${index + 1}`,
      price: (index + 1) * 1000,
      stock,
      status: stock > 0 ? PRODUCT_STATUSES.AVAILABLE : PRODUCT_STATUSES.OUT_OF_STOCK,
    };
  }

  static createCourier(index) {
    return {
      _id: new Types.ObjectId().toString(),
      name: `Repartidor Mock ${index + 1}`,
      zone: `Zona ${index + 1}`,
      available: true,
    };
  }

  static createOrder(index, user, courier) {
    const weight = index + 1;

    return {
      _id: new Types.ObjectId().toString(),
      customerName: user.name,
      customer: user._id,
      address: `Calle Mock ${index + 1}`,
      weight,
      cost: weight * 10,
      status: ORDER_STATUSES.PENDING,
      priority: ORDER_PRIORITIES.NORMAL,
      items: [
        {
          name: `Item Mock ${index + 1}`,
          quantity: 1,
          price: (index + 1) * 1000,
        },
      ],
      courierId: courier._id,
    };
  }

  static createDelivery(order, courier) {
    return {
      _id: new Types.ObjectId().toString(),
      orderId: order._id,
      courierId: courier._id,
      status: DELIVERY_STATUSES.ASSIGNED,
      assignedAt: new Date().toISOString(),
    };
  }
}

module.exports = MocksService;
