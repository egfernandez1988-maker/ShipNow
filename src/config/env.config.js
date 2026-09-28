const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ quiet: true });

const REQUIRED_ENV_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'),
};

module.exports = Object.freeze(config);
