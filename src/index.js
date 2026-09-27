const config = require('./config');
const connectDB = require('./db');
const app = require('./app');
const logger = require('./config/logger.config');

// Conectamos a la base y levantamos el server.
async function startServer() {
  await connectDB();

  app.listen(config.PORT, () => {
    logger.info('ShipNow escuchando en el puerto ' + config.PORT);
  });
}

startServer();
