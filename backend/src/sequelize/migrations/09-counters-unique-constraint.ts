import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize
      .getQueryInterface()
      .removeConstraint('Counters', 'counter_uniqueness_constraint');

    await sequelize.getQueryInterface().addConstraint('Counters', {
      type: 'unique',
      name: 'countersUnique',
      fields: ['agreementId', 'month'],
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const down: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().removeConstraint('Counters', 'countersUnique');

    await sequelize.getQueryInterface().addConstraint('Counters', {
      type: 'unique',
      name: 'counter_uniqueness_constraint',
      fields: ['month'],
    });

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};
