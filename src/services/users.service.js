const UserRepository = require('../repositories/users.repository');
const { USER_ROLES } = require('../constants');

class UserService {
  static async create({ name, email, role }) {
    if (!name || !email) {
      throw new Error('Faltan datos obligatorios del usuario');
    }

    if (role && !Object.values(USER_ROLES).includes(role)) {
      throw new Error('Rol de usuario invalido');
    }

    return UserRepository.create({ name, email, role });
  }

  static async getAll() {
    return UserRepository.getAll();
  }

  static async getById(id) {
    const user = await UserRepository.getById(id);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }
}

module.exports = UserService;
