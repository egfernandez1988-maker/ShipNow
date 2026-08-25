# ShipNow

API de demostracion de una plataforma de **logistica / envios**, construida con
**Node.js + Express + MongoDB (Mongoose)**.

Este proyecto es **material didactico** del curso **Backend 3 de CoderHouse**.
Es la **pre-entrega del Modulo 1**: la API comienza su refactorizacion desde un
modelo monolitico hacia una arquitectura profesional por capas.

## Que hace ShipNow

Gestiona cinco entidades:

- **Order** (envio/pedido): `customerName`, `customer` (ref a User), `address`, `weight`, `cost` (calculado), `status`, `priority`, `items` (array de `{ name, quantity, price }`), `courierId`.
- **User** (cliente): `name`, `email`, `role` (admin / customer / driver).
- **Courier** (repartidor): `name`, `zone`, `available`.
- **Product** (producto): `name`, `price`, `stock`, `status` (available / out_of_stock).
- **Delivery** (entrega): `orderId` (ref a Order), `courierId` (ref a Courier), `status` (assigned / in_transit / delivered), `assignedAt`.

Regla de negocio principal (hoy embebida en la ruta de orders):
`cost = weight * 10`. Al crear un envio tambien se dispara una notificacion falsa.
Al consultar una entrega por id (`GET /api/deliveries/:id`) se llama inline a un
"proveedor externo" de tracking falso (`src/services/trackingProvider.js`).

## Como correrlo

Requisitos: Node.js y una instancia de MongoDB corriendo en `localhost:27017`.

Para levantar MongoDB rapido con Docker:

```bash
docker run -d -p 27017:27017 --name shipnow-mongo mongo
```

Tambien sirve una instalacion local de MongoDB o un cluster de MongoDB Atlas
(en ese caso ajusta la variable `MONGODB_URI` en tu archivo `.env`).

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de entorno
cp .env.example .env

# 3. Completar las variables requeridas en .env
# PORT=8080
# MONGODB_URI=mongodb://localhost:27017/shipnow
# NODE_ENV=development

# 4. (Opcional) Cargar datos de ejemplo relacionados
npm run seed

# 5. Levantar el servidor
npm start
# o
npm run dev
```

El servidor queda escuchando en `http://localhost:8080`.

> La aplicacion valida `PORT`, `MONGODB_URI` y `NODE_ENV` al iniciar. Si falta
> alguna variable, falla inmediatamente con un mensaje claro.

## Arquitectura por capas

Para `Users` y `Products` se separo la responsabilidad en tres capas:

- **Controller:** recibe `req`, llama al service y devuelve la respuesta HTTP con
  el status code correspondiente.
- **Service:** concentra la logica de negocio y validaciones. Por ejemplo,
  `ProductsService.getAll()` filtra los productos sin stock antes de responder.
- **Repository:** es la unica capa de estas entidades que conoce Mongoose y hace
  llamadas directas a MongoDB.

Elegir esta separacion permite que el Controller no dependa de detalles de base
de datos, que las reglas de negocio vivan en un lugar testeable, y que los
repositories se puedan reemplazar o mockear sin reescribir las rutas.

### Endpoints

| Metodo | Ruta                       | Descripcion                       |
| ------ | -------------------------- | --------------------------------- |
| GET    | `/`                        | Health check basico               |
| POST   | `/api/users`               | Crear cliente                     |
| GET    | `/api/users`               | Listar clientes                   |
| GET    | `/api/users/:id`           | Obtener cliente por id            |
| POST   | `/api/products`            | Crear producto                    |
| GET    | `/api/products`            | Listar productos                  |
| GET    | `/api/products/:id`        | Obtener producto por id           |
| POST   | `/api/couriers`            | Crear repartidor                  |
| GET    | `/api/couriers`            | Listar repartidores               |
| GET    | `/api/couriers/:id`        | Obtener repartidor por id         |
| POST   | `/api/orders`              | Crear envio                       |
| GET    | `/api/orders`              | Listar envios                     |
| GET    | `/api/orders/:id`          | Obtener envio por id              |
| PATCH  | `/api/orders/:id/status`   | Cambiar estado de un envio        |
| POST   | `/api/deliveries`          | Crear entrega (order + courier)   |
| GET    | `/api/deliveries`          | Listar entregas                   |
| GET    | `/api/deliveries/:id`      | Obtener entrega + tracking        |
| PATCH  | `/api/deliveries/:id/status` | Cambiar estado de una entrega   |

Ejemplo de creacion de envio:

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Ana Lopez","address":"Calle Falsa 123","weight":5}'
```

## Probar con Postman

En la carpeta `postman/` hay una coleccion lista para importar:
`postman/ShipNow.postman_collection.json`.

1. Abre Postman -> **Import** -> selecciona el archivo.
2. La coleccion trae una variable `{{baseUrl}}` que por defecto apunta a
   `http://localhost:8080`. Si cambias el puerto, edita esa variable.
3. Hay una carpeta por entidad (Users, Products, Couriers, Orders, Deliveries)
   con un request por endpoint. Los POST/PATCH incluyen un body JSON de ejemplo.
4. Para los requests que usan `:id` (o refs como `customer`, `orderId`,
   `courierId`), copia los ids reales de la respuesta de un GET/POST previo.

## Deuda tecnica conocida

Esta seccion es **intencional y honesta**: lista los problemas que el codigo tiene
hoy a proposito, y que iremos resolviendo modulo a modulo durante el curso.

1. **Entidades pendientes de refactor.** `Users` y `Products` ya usan
   Controller-Service-Repository. `Orders`, `Couriers` y `Deliveries` quedan como
   parte del baseline para refactorizar en los siguientes modulos.

2. **Controllers gordos (fat controllers) / logica en las rutas.** Algunas rutas
   que no forman parte de esta pre-entrega todavia mezclan validacion manual,
   logica de negocio, acceso directo a la base y efectos secundarios. El ejemplo
   mas claro es `src/routes/orders.js`.

3. **Acoplamiento del efecto secundario.** La notificacion
   (`src/services/notifications.js`) se importa y se llama inline dentro de la ruta
   de orders, acoplando la logica de negocio con el envio de notificaciones.

4. **Manejo de errores crudo.** Todos los `try/catch` responden con un generico
   `res.status(500).send("Error del servidor")`. No hay una capa de errores ni
   errores de dominio personalizados.

5. **Logging pobre.** Solo se usa `console.log`. No hay un logger real con niveles,
   formato ni transporte.

6. **Validacion manual repetida.** Cada ruta (`products`, `deliveries`, `orders`,
   etc.) repite chequeos `if (!campo)` a mano. No hay esquemas de validacion ni
   middleware reutilizable.

7. **Integracion externa acoplada.** El "proveedor de tracking"
   (`src/services/trackingProvider.js`) se llama inline desde la ruta de
   deliveries, sin abstraccion ni inyeccion. Sirve como ejemplo de algo que
   habra que mockear en los tests.

8. **Verificacion de relaciones en la ruta.** Al crear una delivery se hace
   `Order.findById` / `Courier.findById` directo en el handler para validar que
   existan, acoplando aun mas la ruta a la base.

9. **Sin tests, sin Swagger, sin upload de archivos, sin Docker.** Estas piezas se
   agregan en modulos posteriores; su ausencia aca es intencional. El script de
   seed (`src/seed.js`) y la coleccion de Postman son tooling de apoyo, no
   features de la API.

## Roadmap del curso (que vamos a refactorizar)

- **Modulo 1:** variables de entorno + capa de configuracion (matar el hardcode).
- **Modulos siguientes:** capa de services y repositories, manejo de errores,
  logger profesional, tests, documentacion con Swagger, uploads y Docker.
