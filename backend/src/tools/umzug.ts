import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Umzug, SequelizeStorage } from 'umzug';

import { sequelize } from '../sequelize';
const __dirname = dirname(fileURLToPath(import.meta.url));

export const migrator = new Umzug({
  migrations: {
    glob: ['../sequelize/migrations/*.ts', { cwd: __dirname }],
  },
  context: sequelize,
  storage: new SequelizeStorage({
    sequelize,
    tableName: 'Migrations',
    timestamps: false,
  }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;
