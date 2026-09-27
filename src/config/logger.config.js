const path = require('path');
const winston = require('winston');
const config = require('./env.config');

const logsDirectory = path.join(process.cwd(), 'logs');
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports = [
  new winston.transports.File({
    filename: path.join(logsDirectory, 'error.log'),
    level: 'error',
  }),
  new winston.transports.File({
    filename: path.join(logsDirectory, 'combined.log'),
  }),
];

if (config.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

const logger = winston.createLogger({
  level: config.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  transports,
});

module.exports = logger;
