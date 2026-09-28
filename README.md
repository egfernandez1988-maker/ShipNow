# ShipNow API

API backend para la gestion de usuarios, productos, repartidores, envios y entregas. Fue construida con Node.js, Express y MongoDB como entrega final del curso Backend III.

## Tecnologias

- Node.js y Express
- MongoDB y Mongoose
- Winston para logging
- Multer para carga de documentos y comprobantes
- Swagger UI para documentacion interactiva
- Mocha, Chai, Supertest y mongodb-memory-server para pruebas funcionales
- Docker y Docker Compose

## Arquitectura

Las rutas principales siguen Controller -> Service -> Repository:

- El Controller recibe la solicitud HTTP y responde.
- El Service contiene reglas de negocio, validaciones, calculo de costos, tracking y limpieza de archivos no asociados.
- El Repository concentra las operaciones con Mongoose y MongoDB.

Los mocks no usan Repository porque se generan en memoria y no se persisten. Esta separacion evita que los routers y controllers conozcan detalles de la base de datos.

## Variables de entorno

Crear `.env` a partir de `.env.example` y completar:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/shipnow
NODE_ENV=development
# Opcional. Usa una ruta fuera de OneDrive si el sistema bloquea uploads.
UPLOAD_DIR=C:/shipnow-uploads
```

La aplicacion valida las tres variables al iniciar y falla con un mensaje claro si falta alguna. No subir `.env` al repositorio.

## Ejecucion local

Requisitos: Node.js 22 o superior y MongoDB disponible localmente o en Atlas.

```bash
npm install
npm start
```

En PowerShell, para crear el archivo de entorno:

```powershell
Copy-Item .env.example .env
```

La API queda disponible en `http://localhost:8080`.

## Tests

```bash
npm test
```

La suite usa una instancia temporal de MongoDB en memoria, separada de la base configurada en `.env`. Cubre health check, Swagger, mocks, creacion y actualizacion de envios, entregas, errores y carga de archivos. La primera ejecucion puede descargar el binario temporal de MongoDB.

## Swagger

La documentacion interactiva esta disponible en:

```text
http://localhost:8080/api/docs/
```

Incluye los endpoints actuales de usuarios, productos, repartidores, envios, entregas, mocks, health check y carga de archivos.

El endpoint interno `GET /api/logger/test` genera eventos de prueba y solo esta disponible fuera de produccion.

## Docker

El proyecto incluye un Dockerfile multi-stage y `docker-compose.yml`. Compose inicia MongoDB, espera su health check y luego levanta la API.

```bash
docker compose up --build
```

En instalaciones antiguas de Docker Compose:

```bash
docker-compose up --build
```

La API se publica en `http://localhost:8080`. Para detener y eliminar los contenedores:

```bash
docker compose down
```

Los datos de MongoDB, uploads y logs quedan en volumenes Docker. Para eliminarlos tambien:

```bash
docker compose down -v
```

## Logs y uploads

Winston guarda actividad general en `logs/combined.log` y errores en `logs/error.log`. En desarrollo tambien escribe en consola; en produccion solo usa archivos.

Multer acepta PDF, JPEG y PNG de hasta 5 MB. Por defecto usa `uploads/`; `UPLOAD_DIR` permite definir otra carpeta para entornos sincronizados como OneDrive.

- `POST /api/users/:id/documents` con el campo `document`.
- `POST /api/orders/:id/proofs` con el campo `proof`.
- `POST /api/deliveries/:id/proofs` con el campo `proof`.

Los metadatos se guardan en MongoDB. Los archivos locales de `uploads/`, logs y coverage estan ignorados por Git; `uploads/.gitkeep` preserva la carpeta vacia.

## Endpoints principales

Los endpoints de listado de usuarios, productos, repartidores, envios y entregas aceptan `?page=1&limit=20`. El limite maximo es 100 y responden con `data` y `pagination`.

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/health` | Estado de la API |
| GET | `/api/docs/` | Swagger UI |
| GET | `/api/mocks?quantity=10` | Datos simulados no persistentes |
| GET | `/api/logger/test` | Verificacion de logger fuera de produccion |
| POST / GET | `/api/users` | Crear o listar usuarios |
| GET | `/api/users/:id` | Obtener usuario |
| POST | `/api/users/:id/documents` | Adjuntar documento |
| POST / GET | `/api/products` | Crear o listar productos con stock |
| POST / GET | `/api/couriers` | Crear o listar repartidores |
| POST / GET | `/api/orders` | Crear o listar envios |
| PATCH | `/api/orders/:id/status` | Actualizar estado de envio |
| POST / GET | `/api/deliveries` | Crear o listar entregas |
| GET | `/api/deliveries/:id` | Entrega y tracking |
| PATCH | `/api/deliveries/:id/status` | Actualizar estado de entrega |

Las respuestas de error tienen el formato:

```json
{
  "status": "error",
  "message": "Descripcion del error"
}
```
