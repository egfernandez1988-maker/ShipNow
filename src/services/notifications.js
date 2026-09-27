const logger = require('../config/logger.config');

function sendNotification(message) {
  logger.info('Notificacion enviada', { message });
}

module.exports = sendNotification;
