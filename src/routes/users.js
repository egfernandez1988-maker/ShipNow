const express = require('express');
const router = express.Router();

const UserController = require('../controller/user.controller');
const UploadsController = require('../controller/uploads.controller');
const upload = require('../config/upload.config');

// POST /api/users -> crea un cliente
router.post('/', UserController.create);

// GET /api/users -> lista clientes
router.get('/', UserController.getAll);

// GET /api/users/:id -> obtiene un cliente por id
router.get('/:id', UserController.getById);

router.post('/:id/documents', upload.single('document'), UploadsController.addUserDocument);

module.exports = router;
