import fs from 'fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { SequelizeOptions } from 'sequelize-typescript';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = await fs.readFile(join(__dirname, '../../../.env'), 'utf8');

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST_NAME, DB_PORT, MODE } = dotenv.parse(env);

const options: SequelizeOptions = {
  dialect: 'mysql',
  host: DB_HOST_NAME || 'localhost',
  port: parseInt(DB_PORT || '3306'),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  timezone: '+03:00',
  logging: false,
  // logging: sql => {
  //   if (MODE === 'dev') {
  //     console.log(chalk.gray(sql));
  //   }
  // },
  define: {
    timestamps: true,
    paranoid: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  },
  pool: {
    idle: 1000,
  },
};

export default options;
