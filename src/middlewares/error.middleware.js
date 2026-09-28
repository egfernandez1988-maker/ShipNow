const {
  AppError,
  NotFoundError,
  ValidationError,
} = require('../errors/app.error');
const logger = require('../config/logger.config');

function notFoundHandler(req, res, next) {
  next(new NotFoundError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
  let normalizedError = error;

  if (error.name === 'CastError') {
    normalizedError = new ValidationError('El identificador proporcionado no es valido');
  }

  if (error.name === 'ValidationError') {
    normalizedError = new ValidationError(error.message);
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    normalizedError = new ValidationError('El archivo supera el limite de 5 MB');
  }

  const statusCode = normalizedError instanceof AppError
    ? normalizedError.statusCode
    : 500;
  const message = normalizedError instanceof AppError
    ? normalizedError.message
    : 'Error interno del servidor';

  const logData = {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: normalizedError.message,
  };

  if (statusCode >= 500) {
    logger.error('Error no controlado en la solicitud', logData);
  } else {
    logger.warn('Error de solicitud', logData);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
