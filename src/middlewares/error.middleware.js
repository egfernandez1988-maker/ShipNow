const {
  AppError,
  NotFoundError,
  ValidationError,
} = require('../errors/app.error');

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

  const statusCode = normalizedError instanceof AppError
    ? normalizedError.statusCode
    : 500;
  const message = normalizedError instanceof AppError
    ? normalizedError.message
    : 'Error interno del servidor';

  res.status(statusCode).json({
    status: 'error',
    message,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
