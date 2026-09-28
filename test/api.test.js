const os = require('os');
const path = require('path');

process.env.NODE_ENV = 'test';
process.env.PORT = '8080';
process.env.MONGODB_URI = 'mongodb://localhost:27017/shipnow-test';
process.env.UPLOAD_DIR = path.join(os.tmpdir(), 'shipnow-test-uploads');

const fs = require('fs/promises');
const { expect } = require('chai');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../src/app');
const logger = require('../src/config/logger.config');
const config = require('../src/config');

let mongoServer;

async function cleanUploads() {
  await fs.rm(config.UPLOAD_DIR, { recursive: true, force: true });
}

describe('ShipNow API', () => {
  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
    await cleanUploads();
    logger.close();
  });

  it('responde el health check', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ status: 'ok', service: 'shipnow-api' });
  });

  it('expone Swagger', async () => {
    const response = await request(app).get('/api/docs/');

    expect(response.status).to.equal(200);
    expect(response.text).to.include('Swagger UI');
  });

  it('genera mocks y valida cantidades invalidas', async () => {
    const successResponse = await request(app).get('/api/mocks?quantity=2');
    const errorResponse = await request(app).get('/api/mocks?quantity=101');

    expect(successResponse.status).to.equal(200);
    expect(successResponse.body.users).to.have.lengthOf(2);
    expect(successResponse.body.deliveries[0].orderId)
      .to.equal(successResponse.body.orders[0]._id);
    expect(errorResponse.status).to.equal(400);
    expect(errorResponse.body).to.include({ status: 'error' });
  });

  it('pagina los listados y limita el tamano de respuesta', async () => {
    await request(app).post('/api/users').send({ name: 'Usuario Uno', email: 'uno@example.com' });
    await request(app).post('/api/users').send({ name: 'Usuario Dos', email: 'dos@example.com' });

    const response = await request(app).get('/api/users?page=1&limit=1');

    expect(response.status).to.equal(200);
    expect(response.body.data).to.have.lengthOf(1);
    expect(response.body.pagination).to.include({ page: 1, limit: 1 });
    expect(response.body.pagination.total).to.be.at.least(2);
  });

  it('ejecuta el endpoint interno de logger fuera de produccion', async () => {
    const response = await request(app).get('/api/logger/test');

    expect(response.status).to.equal(200);
    expect(response.body).to.include({ status: 'ok' });
  });

  it('crea y actualiza el estado de un envio', async () => {
    const createResponse = await request(app)
      .post('/api/orders')
      .send({ customerName: 'Ana Lopez', address: 'Calle 123', weight: 2.5 });

    expect(createResponse.status).to.equal(201);
    expect(createResponse.body.cost).to.equal(25);
    expect(createResponse.body.status).to.equal('pending');

    const updateResponse = await request(app)
      .patch(`/api/orders/${createResponse.body._id}/status`)
      .send({ status: 'in_transit' });

    expect(updateResponse.status).to.equal(200);
    expect(updateResponse.body.status).to.equal('in_transit');
  });

  it('devuelve un error de validacion para un envio invalido', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({ customerName: 'Ana Lopez', address: 'Calle 123', weight: 0 });

    expect(response.status).to.equal(400);
    expect(response.body).to.include({ status: 'error' });
    expect(response.body.message).to.equal('El peso debe ser un numero mayor a 0');
  });

  it('crea una entrega y devuelve tracking', async () => {
    const orderResponse = await request(app)
      .post('/api/orders')
      .send({ customerName: 'Luis Perez', address: 'Avenida 456', weight: 1 });
    const courierResponse = await request(app)
      .post('/api/couriers')
      .send({ name: 'Maria Soto', zone: 'Centro' });

    const deliveryResponse = await request(app)
      .post('/api/deliveries')
      .send({ orderId: orderResponse.body._id, courierId: courierResponse.body._id });

    expect(deliveryResponse.status).to.equal(201);

    const trackingResponse = await request(app)
      .get(`/api/deliveries/${deliveryResponse.body._id}`);

    expect(trackingResponse.status).to.equal(200);
    expect(trackingResponse.body.delivery._id).to.equal(deliveryResponse.body._id);
    expect(trackingResponse.body.tracking.status).to.be.a('string');
  });

  it('carga un documento PDF y guarda sus metadatos', async () => {
    const userResponse = await request(app)
      .post('/api/users')
      .send({ name: 'Carla Diaz', email: 'carla@example.com' });

    const uploadResponse = await request(app)
      .post(`/api/users/${userResponse.body._id}/documents`)
      .attach('document', Buffer.from('contenido de prueba'), {
        filename: 'documento.pdf',
        contentType: 'application/pdf',
      });

    expect(uploadResponse.status).to.equal(200);
    expect(uploadResponse.body.documents).to.have.lengthOf(1);
    expect(uploadResponse.body.documents[0]).to.include({
      originalName: 'documento.pdf',
      mimetype: 'application/pdf',
    });
  });

  it('rechaza archivos de tipo no permitido', async () => {
    const userResponse = await request(app)
      .post('/api/users')
      .send({ name: 'Pedro Rojas', email: 'pedro@example.com' });

    const uploadResponse = await request(app)
      .post(`/api/users/${userResponse.body._id}/documents`)
      .attach('document', Buffer.from('contenido de prueba'), {
        filename: 'documento.txt',
        contentType: 'text/plain',
      });

    expect(uploadResponse.status).to.equal(400);
    expect(uploadResponse.body.message).to.equal('Solo se permiten archivos PDF, JPEG o PNG');
  });

  it('devuelve JSON estandarizado para una ruta inexistente', async () => {
    const response = await request(app).get('/api/no-existe');

    expect(response.status).to.equal(404);
    expect(response.body).to.include({ status: 'error' });
  });
});
