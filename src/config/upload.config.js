const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require('./env.config');
const { UPLOAD_LIMITS } = require('../constants');
const { InvalidFileTypeError } = require('../errors/app.error');

const uploadDirectory = config.UPLOAD_DIR;

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, uploadDirectory),
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, callback) => {
    if (!UPLOAD_LIMITS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return callback(new InvalidFileTypeError('Solo se permiten archivos PDF, JPEG o PNG'));
    }

    callback(null, true);
  },
});

module.exports = upload;
