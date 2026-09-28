const config = require('../config');
const logger = require('../config/logger.config');
const { ForbiddenError } = require('../errors/app.error');

class LoggerService {
  static runTest() {
    if (config.NODE_ENV === 'production') {
      throw new ForbiddenError('El endpoint interno de logger no esta disponible en produccion');
    }

    logger.debug('Logger test: debug');
    logger.info('Logger test: info');
    logger.warn('Logger test: warn');
    logger.error('Logger test: error');

    return { status: 'ok', message: 'Eventos de logger generados' };
  }
}

module.exports = LoggerService;
