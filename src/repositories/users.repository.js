const User = require('../models/user');
const { USER_ROLES } = require('../constants');

class UserRepository {
  static async create({ name, email, role }) {
    const user = await User.create({
      name,
      email,
      role: role || USER_ROLES.USER,
    });

    return user;
  }

  static async getAll() {
    return User.find();
  }

  static async getById(id) {
    return User.findById(id);
  }

  static async addDocument(id, document) {
    return User.findByIdAndUpdate(
      id,
      { $push: { documents: document } },
      { new: true, runValidators: true }
    );
  }
}

module.exports = UserRepository;
