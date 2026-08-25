const express = require('express');
const router = express.Router();

const UserController = require('../controller/user.controller');

// POST /api/users -> crea un cliente
router.post('/', UserController.create);

// GET /api/users -> lista clientes
router.get('/', UserController.getAll);

// GET /api/users/:id -> obtiene un cliente por id
router.get('/:id', UserController.getById);

module.exports = router;
