const express = require('express');
const router = express.Router();

const ProductController = require('../controller/product.controller');

// POST /api/products -> crea un producto
router.post('/', ProductController.create);

// GET /api/products -> lista productos con stock disponible
router.get('/', ProductController.getAll);

// GET /api/products/:id -> obtiene un producto por id
router.get('/:id', ProductController.getById);

module.exports = router;
