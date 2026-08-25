const UserService = require('../services/users.service');

class UserController {
  static async create(req, res) {
    try {
      const { name, email, role } = req.body;

      const user = await UserService.create({ name, email, role });

      console.log('User creado:', user._id);
      res.status(201).json(user);
    } catch (error) {
      console.log('Error al crear user:', error.message);
      res.status(400).send(error.message);
    }
  }

  static async getAll(req, res) {
    try {
      const users = await UserService.getAll();

      res.json(users);
    } catch (error) {
      console.log('Error al listar users:', error.message);
      res.status(500).send('Error del servidor');
    }
  }

  static async getById(req, res) {
    try {
      const user = await UserService.getById(req.params.id);

      res.json(user);
    } catch (error) {
      console.log('Error al buscar user:', error.message);
      const statusCode = error.message === 'Usuario no encontrado' ? 404 : 500;
      res.status(statusCode).send(statusCode === 404 ? error.message : 'Error del servidor');
    }
  }
}

module.exports = UserController;
