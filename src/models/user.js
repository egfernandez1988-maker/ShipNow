const mongoose = require('mongoose');
const { USER_ROLES } = require('../constants');

// Modelo de User (cliente).
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.USER,
  },
});

module.exports = mongoose.model('User', userSchema);
