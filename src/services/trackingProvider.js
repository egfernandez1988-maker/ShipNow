const logger = require('../config/logger.config');

const TRACKING_STATES = ['assigned', 'in_transit', 'out_for_delivery', 'delivered'];

function getTrackingStatus(deliveryId) {
  logger.debug('Consultando tracking provider', { deliveryId: String(deliveryId) });

  const id = String(deliveryId || '');
  const index = id.length % TRACKING_STATES.length;
  return TRACKING_STATES[index];
}

module.exports = { getTrackingStatus };
