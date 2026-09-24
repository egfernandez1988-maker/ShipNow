const PRODUCT_STATUSES = Object.freeze({
  AVAILABLE: 'available',
  OUT_OF_STOCK: 'out_of_stock',
});

const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
  DRIVER: 'driver',
});

const ORDER_STATUSES = Object.freeze({
  PENDING: 'pending',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
});

const ORDER_PRIORITIES = Object.freeze({
  NORMAL: 'normal',
  HIGH: 'high',
});

const DELIVERY_STATUSES = Object.freeze({
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
});

module.exports = Object.freeze({
  PRODUCT_STATUSES,
  USER_ROLES,
  ORDER_STATUSES,
  ORDER_PRIORITIES,
  DELIVERY_STATUSES,
});
