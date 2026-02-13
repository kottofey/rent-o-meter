import { Op, QueryInterface } from 'sequelize';
import chalk from 'chalk';
import { log } from 'eslint-import-resolver-typescript/lib/logger';

import { type SeederModule } from '../../tools/seed.ts';

import { sequelize } from '@/sequelize';

const permissions = [
  // Agreements
  { name: 'agreements.create', resource: 'agreements', action: 'create' },
  { name: 'agreements.read', resource: 'agreements', action: 'read' },
  { name: 'agreements.update', resource: 'agreements', action: 'update' },
  { name: 'agreements.delete', resource: 'agreements', action: 'delete' },

  // Bills
  { name: 'bills.create', resource: 'bills', action: 'create' },
  { name: 'bills.read', resource: 'bills', action: 'read' },
  { name: 'bills.update', resource: 'bills', action: 'update' },
  { name: 'bills.delete', resource: 'bills', action: 'delete' },

  // PayMonths
  { name: 'counters.create', resource: 'counters', action: 'create' },
  { name: 'counters.read', resource: 'counters', action: 'read' },
  { name: 'counters.update', resource: 'counters', action: 'update' },
  { name: 'counters.delete', resource: 'counters', action: 'delete' },

  // Rentees
  { name: 'rentees.create', resource: 'rentees', action: 'create' },
  { name: 'rentees.read', resource: 'rentees', action: 'read' },
  { name: 'rentees.update', resource: 'rentees', action: 'update' },
  { name: 'rentees.delete', resource: 'rentees', action: 'delete' },

  // Tariffs
  { name: 'tariffs.create', resource: 'tariffs', action: 'create' },
  { name: 'tariffs.read', resource: 'tariffs', action: 'read' },
  { name: 'tariffs.update', resource: 'tariffs', action: 'update' },
  { name: 'tariffs.delete', resource: 'tariffs', action: 'delete' },

  // Users
  { name: 'users.create', resource: 'users', action: 'create' },
  { name: 'users.read', resource: 'users', action: 'read' },
  { name: 'users.update', resource: 'users', action: 'update' },
  { name: 'users.delete', resource: 'users', action: 'delete' },

  // System
  { name: 'system.manage', resource: 'system', action: 'manage' },
];

const seeder: SeederModule = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      await queryInterface.bulkInsert(
        'Permissions',
        permissions.map(p => ({
          ...p,
          description: `${p.action} ${p.resource}`,
          status: true,
        })),
        { transaction },
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await sequelize.transaction();
    console.log(
      chalk.yellow(
        JSON.stringify(
          permissions.map(p => ({
            ...p,
            description: `${p.action} ${p.resource}`,
            status: true,
          })),
          null,
          2,
        ),
      ),
    );
    try {
      await queryInterface.bulkDelete(
        'Permissions',

        {
          [Op.or]: permissions.map(p => ({
            ...p,
            description: `${p.action} ${p.resource}`,
            status: true,
          })),
        },
        { transaction, logging: console.log },
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },
};

export default seeder;
