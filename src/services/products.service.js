const ProductRepository = require('../repositories/products.repository');
const { PRODUCT_STATUSES } = require('../constants');
const { NotFoundError, ValidationError } = require('../errors/app.error');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');

class ProductService {
  static async create({ name, price, stock, status }) {
    if (!name || price === undefined) {
      throw new ValidationError('Faltan datos obligatorios del producto');
    }

    if (typeof price !== 'number' || price < 0) {
      throw new ValidationError('El precio debe ser un numero mayor o igual a 0');
    }

    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      throw new ValidationError('El stock debe ser un numero mayor o igual a 0');
    }

    if (status && !Object.values(PRODUCT_STATUSES).includes(status)) {
      throw new ValidationError('Estado de producto invalido');
    }

    const productStock = stock !== undefined ? stock : 0;

    return ProductRepository.create({
      name,
      price,
      stock: productStock,
      status: status || ProductService.getStatusByStock(productStock),
    });
  }

  static async getAll(query) {
    const pagination = parsePagination(query);
    const { data, total } = await ProductRepository.getAll({ ...pagination, filter: { stock: { $gt: 0 } } });
    return buildPaginatedResponse(data, total, pagination);
  }

  static async getById(id) {
    const product = await ProductRepository.getById(id);

    if (!product) {
      throw new NotFoundError('Producto no encontrado');
    }

    return product;
  }

  static getStatusByStock(stock) {
    return stock > 0 ? PRODUCT_STATUSES.AVAILABLE : PRODUCT_STATUSES.OUT_OF_STOCK;
  }
}

module.exports = ProductService;
