const swaggerJsdoc = require('swagger-jsdoc');

const jsonContent = (schema) => ({
  'application/json': { schema },
});

const successResponse = (description, schema) => ({
  description,
  content: jsonContent(schema),
});

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'ShipNow API',
    version: '1.0.0',
    description: 'API para la gestion de envios, entregas y usuarios de ShipNow.',
  },
  servers: [{ url: 'http://localhost:8080', description: 'Servidor local' }],
  tags: [
    { name: 'Health', description: 'Estado de la aplicacion' },
    { name: 'Users', description: 'Gestion de usuarios' },
    { name: 'Products', description: 'Gestion de productos' },
    { name: 'Couriers', description: 'Gestion de repartidores' },
    { name: 'Orders', description: 'Gestion de envios' },
    { name: 'Deliveries', description: 'Gestion y tracking de entregas' },
    { name: 'Mocks', description: 'Datos simulados no persistentes' },
    { name: 'Files', description: 'Documentos y comprobantes adjuntos' },
    { name: 'Logger', description: 'Verificacion interna de logging' },
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Consulta el estado de la API',
        responses: { 200: successResponse('API disponible', { $ref: '#/components/schemas/Health' }) },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'], summary: 'Lista usuarios',
        responses: { 200: successResponse('Usuarios obtenidos', { type: 'array', items: { $ref: '#/components/schemas/User' } }), 500: { $ref: '#/components/responses/InternalError' } },
      },
      post: {
        tags: ['Users'], summary: 'Crea un usuario',
        requestBody: { required: true, content: jsonContent({ $ref: '#/components/schemas/UserInput' }) },
        responses: { 201: successResponse('Usuario creado', { $ref: '#/components/schemas/User' }), 400: { $ref: '#/components/responses/BadRequest' }, 500: { $ref: '#/components/responses/InternalError' } },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'], summary: 'Obtiene un usuario por id', parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: { 200: successResponse('Usuario obtenido', { $ref: '#/components/schemas/User' }), 400: { $ref: '#/components/responses/BadRequest' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/api/products': {
      get: {
        tags: ['Products'], summary: 'Lista productos con stock',
        responses: { 200: successResponse('Productos obtenidos', { type: 'array', items: { $ref: '#/components/schemas/Product' } }), 500: { $ref: '#/components/responses/InternalError' } },
      },
      post: {
        tags: ['Products'], summary: 'Crea un producto',
        requestBody: { required: true, content: jsonContent({ $ref: '#/components/schemas/ProductInput' }) },
        responses: { 201: successResponse('Producto creado', { $ref: '#/components/schemas/Product' }), 400: { $ref: '#/components/responses/BadRequest' } },
      },
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'], summary: 'Obtiene un producto por id', parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: { 200: successResponse('Producto obtenido', { $ref: '#/components/schemas/Product' }), 400: { $ref: '#/components/responses/BadRequest' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/api/couriers': {
      get: {
        tags: ['Couriers'], summary: 'Lista repartidores',
        responses: { 200: successResponse('Repartidores obtenidos', { type: 'array', items: { $ref: '#/components/schemas/Courier' } }), 500: { $ref: '#/components/responses/InternalError' } },
      },
      post: {
        tags: ['Couriers'], summary: 'Crea un repartidor',
        requestBody: { required: true, content: jsonContent({ $ref: '#/components/schemas/CourierInput' }) },
        responses: { 201: successResponse('Repartidor creado', { $ref: '#/components/schemas/Courier' }), 400: { $ref: '#/components/responses/BadRequest' } },
      },
    },
    '/api/couriers/{id}': {
      get: {
        tags: ['Couriers'], summary: 'Obtiene un repartidor por id', parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: { 200: successResponse('Repartidor obtenido', { $ref: '#/components/schemas/Courier' }), 400: { $ref: '#/components/responses/BadRequest' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/api/orders': {
      get: {
        tags: ['Orders'], summary: 'Lista envios',
        responses: { 200: successResponse('Envios obtenidos', { type: 'array', items: { $ref: '#/components/schemas/Order' } }), 500: { $ref: '#/components/responses/InternalError' } },
      },
      post: {
        tags: ['Orders'], summary: 'Crea un envio',
        requestBody: { required: true, content: jsonContent({ $ref: '#/components/schemas/OrderInput' }) },
        responses: { 201: successResponse('Envio creado', { $ref: '#/components/schemas/Order' }), 400: { $ref: '#/components/responses/BadRequest' } },
      },
    },
    '/api/orders/{id}': {
      get: {
        tags: ['Orders'], summary: 'Obtiene un envio por id', parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: { 200: successResponse('Envio obtenido', { $ref: '#/components/schemas/Order' }), 400: { $ref: '#/components/responses/BadRequest' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/api/orders/{id}/status': {
      patch: {
        tags: ['Orders'], summary: 'Actualiza el estado de un envio', parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: { required: true, content: jsonContent({ $ref: '#/components/schemas/OrderStatusInput' }) },
        responses: { 200: successResponse('Envio actualizado', { $ref: '#/components/schemas/Order' }), 400: { $ref: '#/components/responses/BadRequest' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/api/deliveries': {
      get: {
        tags: ['Deliveries'], summary: 'Lista entregas',
        responses: { 200: successResponse('Entregas obtenidas', { type: 'array', items: { $ref: '#/components/schemas/Delivery' } }), 500: { $ref: '#/components/responses/InternalError' } },
      },
      post: {
        tags: ['Deliveries'], summary: 'Crea una entrega',
        requestBody: { required: true, content: jsonContent({ $ref: '#/components/schemas/DeliveryInput' }) },
        responses: { 201: successResponse('Entrega creada', { $ref: '#/components/schemas/Delivery' }), 400: { $ref: '#/components/responses/BadRequest' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/api/deliveries/{id}': {
      get: {
        tags: ['Deliveries'], summary: 'Obtiene una entrega y su tracking', parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: { 200: successResponse('Entrega obtenida', { $ref: '#/components/schemas/TrackingResponse' }), 400: { $ref: '#/components/responses/BadRequest' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/api/deliveries/{id}/status': {
      patch: {
        tags: ['Deliveries'], summary: 'Actualiza el estado de una entrega', parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: { required: true, content: jsonContent({ $ref: '#/components/schemas/DeliveryStatusInput' }) },
        responses: { 200: successResponse('Entrega actualizada', { $ref: '#/components/schemas/Delivery' }), 400: { $ref: '#/components/responses/BadRequest' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/api/mocks': {
      get: {
        tags: ['Mocks'], summary: 'Genera datos simulados sin persistirlos',
        parameters: [{ name: 'quantity', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 } }],
        responses: { 200: successResponse('Mocks generados', { $ref: '#/components/schemas/MocksResponse' }), 400: { $ref: '#/components/responses/BadRequest' } },
      },
    },
    '/api/logger/test': {
      get: {
        tags: ['Logger'], summary: 'Genera eventos de prueba del logger',
        description: 'Disponible fuera de produccion. En produccion responde 403.',
        responses: { 200: successResponse('Eventos generados', { $ref: '#/components/schemas/LoggerResponse' }), 403: { $ref: '#/components/responses/Forbidden' } },
      },
    },
    '/api/users/{id}/documents': {
      post: {
        tags: ['Files'], summary: 'Adjunta un documento a un usuario', parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['document'], properties: { document: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: successResponse('Documento asociado', { $ref: '#/components/schemas/User' }), 400: { $ref: '#/components/responses/BadRequest' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/api/orders/{id}/proofs': {
      post: {
        tags: ['Files'], summary: 'Adjunta un comprobante a un envio', parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['proof'], properties: { proof: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: successResponse('Comprobante asociado', { $ref: '#/components/schemas/Order' }), 400: { $ref: '#/components/responses/BadRequest' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
    '/api/deliveries/{id}/proofs': {
      post: {
        tags: ['Files'], summary: 'Adjunta un comprobante a una entrega', parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['proof'], properties: { proof: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: successResponse('Comprobante asociado', { $ref: '#/components/schemas/Delivery' }), 400: { $ref: '#/components/responses/BadRequest' }, 404: { $ref: '#/components/responses/NotFound' } },
      },
    },
  },
  components: {
    parameters: { Id: { name: 'id', in: 'path', required: true, schema: { type: 'string' } } },
    responses: {
      BadRequest: successResponse('Datos invalidos', { $ref: '#/components/schemas/Error' }),
      NotFound: successResponse('Recurso no encontrado', { $ref: '#/components/schemas/Error' }),
      InternalError: successResponse('Error interno', { $ref: '#/components/schemas/Error' }),
      Forbidden: successResponse('Acceso no permitido', { $ref: '#/components/schemas/Error' }),
    },
    schemas: {
      Error: { type: 'object', required: ['status', 'message'], properties: { status: { type: 'string', example: 'error' }, message: { type: 'string', example: 'Recurso no encontrado' } } },
      Health: { type: 'object', properties: { status: { type: 'string', example: 'ok' }, service: { type: 'string', example: 'shipnow-api' } } },
      UserInput: { type: 'object', required: ['name', 'email'], properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, role: { type: 'string', enum: ['admin', 'user', 'driver'] } } },
      User: { allOf: [{ $ref: '#/components/schemas/UserInput' }, { type: 'object', properties: { _id: { type: 'string' } } }] },
      ProductInput: { type: 'object', required: ['name', 'price'], properties: { name: { type: 'string' }, price: { type: 'number', minimum: 0 }, stock: { type: 'integer', minimum: 0 }, status: { type: 'string', enum: ['available', 'out_of_stock'] } } },
      Product: { allOf: [{ $ref: '#/components/schemas/ProductInput' }, { type: 'object', properties: { _id: { type: 'string' } } }] },
      CourierInput: { type: 'object', required: ['name', 'zone'], properties: { name: { type: 'string' }, zone: { type: 'string' }, available: { type: 'boolean', default: true } } },
      Courier: { allOf: [{ $ref: '#/components/schemas/CourierInput' }, { type: 'object', properties: { _id: { type: 'string' } } }] },
      OrderInput: { type: 'object', required: ['customerName', 'address', 'weight'], properties: { customerName: { type: 'string' }, customer: { type: 'string' }, address: { type: 'string' }, weight: { type: 'number', minimum: 0.01 }, courierId: { type: 'string' }, priority: { type: 'string', enum: ['normal', 'high'] }, items: { type: 'array', items: { type: 'object' } } } },
      OrderStatusInput: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['pending', 'in_transit', 'delivered'] } } },
      Order: { allOf: [{ $ref: '#/components/schemas/OrderInput' }, { type: 'object', properties: { _id: { type: 'string' }, cost: { type: 'number' }, status: { type: 'string', enum: ['pending', 'in_transit', 'delivered'] } } }] },
      DeliveryInput: { type: 'object', required: ['orderId', 'courierId'], properties: { orderId: { type: 'string' }, courierId: { type: 'string' }, status: { type: 'string', enum: ['assigned', 'in_transit', 'delivered'] } } },
      DeliveryStatusInput: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['assigned', 'in_transit', 'delivered'] } } },
      Delivery: { allOf: [{ $ref: '#/components/schemas/DeliveryInput' }, { type: 'object', properties: { _id: { type: 'string' }, assignedAt: { type: 'string', format: 'date-time' } } }] },
      TrackingResponse: { type: 'object', properties: { delivery: { $ref: '#/components/schemas/Delivery' }, tracking: { type: 'object', properties: { status: { type: 'string' } } } } },
      MocksResponse: { type: 'object', properties: { users: { type: 'array', items: { $ref: '#/components/schemas/User' } }, products: { type: 'array', items: { $ref: '#/components/schemas/Product' } }, couriers: { type: 'array', items: { $ref: '#/components/schemas/Courier' } }, orders: { type: 'array', items: { $ref: '#/components/schemas/Order' } }, deliveries: { type: 'array', items: { $ref: '#/components/schemas/Delivery' } } } },
      LoggerResponse: { type: 'object', properties: { status: { type: 'string', example: 'ok' }, message: { type: 'string', example: 'Eventos de logger generados' } } },
    },
  },
};

const paginationParameters = [
  { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
  { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
];

for (const path of ['/api/users', '/api/products', '/api/couriers', '/api/orders', '/api/deliveries']) {
  swaggerDefinition.paths[path].get.parameters = paginationParameters;
  swaggerDefinition.paths[path].get.responses[200] = successResponse('Resultados paginados', {
    type: 'object',
    properties: {
      data: { type: 'array', items: {} },
      pagination: { type: 'object', properties: { page: { type: 'integer' }, limit: { type: 'integer' }, total: { type: 'integer' }, totalPages: { type: 'integer' } } },
    },
  });
}

module.exports = swaggerJsdoc({ definition: swaggerDefinition, apis: [] });
