import { dirname } from 'node:path';
import path from 'path';
import { fileURLToPath } from 'node:url';
import * as process from 'node:process';

import dotenv from 'dotenv';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

const envConfig = dotenv.config({
  path: path.resolve(rootDir, '.env'),
});

try {
  if (envConfig.error) {
    throw new Error(`Не удалось загрузить .env: ${envConfig.error.message}`);
  }

  // Валидируем обязательные переменные
  let requiredEnvVars = [
    'DB_HOST_NAME',
    'DB_PASSWORD',
    'DB_PORT',
    'DB_NAME',
    'DB_USERNAME',
    'JWT_SECRET',
  ];
  for (const key of requiredEnvVars) {
    if (process.env[key]) {
      requiredEnvVars = requiredEnvVars.filter(v => v !== key);
    }
  }

  if (requiredEnvVars.length > 0) {
    throw new Error(`Отсутствует обязательные переменные окружения: ${requiredEnvVars.toString()}`);
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}

export default envConfig.parsed as Record<string, string | number>;
