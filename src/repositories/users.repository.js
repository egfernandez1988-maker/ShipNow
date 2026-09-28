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

  static async getAll({ skip, limit }) {
    const [data, total] = await Promise.all([User.find().skip(skip).limit(limit), User.countDocuments()]);
    return { data, total };
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
