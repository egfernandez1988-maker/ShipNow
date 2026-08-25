const ProductService = require('../services/products.service');

class ProductController {
  static async create(req, res) {
    try {
      const { name, price, stock, status } = req.body;
      const product = await ProductService.create({ name, price, stock, status });

      console.log('Product creado:', product._id);
      res.status(201).json(product);
    } catch (error) {
      console.log('Error al crear product:', error.message);
      res.status(400).send(error.message);
    }
  }

  static async getAll(req, res) {
    try {
      const products = await ProductService.getAll();

      res.json(products);
    } catch (error) {
      console.log('Error al listar products:', error.message);
      res.status(500).send('Error del servidor');
    }
  }

  static async getById(req, res) {
    try {
      const product = await ProductService.getById(req.params.id);

      res.json(product);
    } catch (error) {
      console.log('Error al buscar product:', error.message);
      const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
      res.status(statusCode).send(statusCode === 404 ? error.message : 'Error del servidor');
    }
  }
}

module.exports = ProductController;
