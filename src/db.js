const mongoose = require('mongoose'); // ORM -> mongodb
const config = require('./config');
const logger = require('./config/logger.config');

async function connectDB() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('Conectado a MongoDB');
  } catch (error) {
    logger.error('Error al conectar a MongoDB', { error: error.message });
    process.exit(1);
  }
}

module.exports = connectDB;
