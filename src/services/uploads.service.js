const fs = require('fs/promises');
const path = require('path');
const UserRepository = require('../repositories/users.repository');
const OrderRepository = require('../repositories/orders.repository');
const DeliveryRepository = require('../repositories/deliveries.repository');
const { FileRequiredError, NotFoundError } = require('../errors/app.error');
const logger = require('../config/logger.config');

class UploadsService {
  static async addUserDocument(userId, file) {
    return UploadsService.saveFile({
      id: userId,
      file,
      save: UserRepository.addDocument,
      resourceName: 'Usuario',
      metadataKey: 'document',
    });
  }

  static async addOrderProof(orderId, file) {
    return UploadsService.saveFile({
      id: orderId,
      file,
      save: OrderRepository.addProof,
      resourceName: 'Envio',
      metadataKey: 'proof',
    });
  }

  static async addDeliveryProof(deliveryId, file) {
    return UploadsService.saveFile({
      id: deliveryId,
      file,
      save: DeliveryRepository.addProof,
      resourceName: 'Entrega',
      metadataKey: 'proof',
    });
  }

  static async saveFile({ id, file, save, resourceName, metadataKey }) {
    if (!file) {
      throw new FileRequiredError('Se requiere un archivo');
    }

    const metadata = UploadsService.createMetadata(file);

    try {
      const resource = await save(id, metadata);

      if (!resource) {
        throw new NotFoundError(`${resourceName} no encontrado`);
      }

      logger.info('Archivo asociado a recurso', {
        resourceName,
        resourceId: id,
        filename: metadata.filename,
        metadataKey,
      });

      return resource;
    } catch (error) {
      await UploadsService.deleteFile(file.path);
      throw error;
    }
  }

  static createMetadata(file) {
    return {
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: path.posix.join('uploads', file.filename),
      uploadedAt: new Date(),
    };
  }

  static async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        logger.error('No se pudo eliminar un archivo sin asociar', {
          path: filePath,
          error: error.message,
        });
      }
    }
  }
}

module.exports = UploadsService;
