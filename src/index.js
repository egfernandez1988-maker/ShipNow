const config = require('./config');
const connectDB = require('./db');
const app = require('./app');

// Conectamos a la base y levantamos el server.
async function startServer() {
  await connectDB();

  app.listen(config.PORT, () => {
    console.log('ShipNow escuchando en el puerto ' + config.PORT);
  });
}

startServer();
