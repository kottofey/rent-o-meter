import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.getQueryInterface().renameTable('PayMonths', 'Counters');
};

export const down: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.getQueryInterface().renameTable('Counters', 'PayMonths');
};
