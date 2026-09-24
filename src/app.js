const express = require('express');

const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');
const couriersRouter = require('./routes/couriers');
const productsRouter = require('./routes/products');
const deliveriesRouter = require('./routes/deliveries');
const {
  notFoundHandler,
  errorHandler,
} = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());

app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/couriers', couriersRouter);
app.use('/api/products', productsRouter);
app.use('/api/deliveries', deliveriesRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'shipnow-api',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
