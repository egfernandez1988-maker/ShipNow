class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Datos invalidos') {
    super(message, 400);
  }
}

class InvalidStatusError extends AppError {
  constructor(message = 'Estado invalido') {
    super(message, 400);
  }
}

class FileRequiredError extends AppError {
  constructor(message = 'Se requiere un archivo') {
    super(message, 400);
  }
}

class InvalidFileTypeError extends AppError {
  constructor(message = 'Tipo de archivo invalido') {
    super(message, 400);
  }
}

class InvalidMockQuantityError extends AppError {
  constructor(message = 'Cantidad de mocks invalida') {
    super(message, 400);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  InvalidStatusError,
  FileRequiredError,
  InvalidFileTypeError,
  InvalidMockQuantityError,
};
