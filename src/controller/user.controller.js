const UserService = require('../services/users.service');

class UserController {
  static async create(req, res, next) {
    try {
      const { name, email, role } = req.body;

      const user = await UserService.create({ name, email, role });

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const users = await UserService.getAll();

      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const user = await UserService.getById(req.params.id);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
