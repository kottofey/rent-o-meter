import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

import { dayjs } from '@/helpers';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'Tarifs',
      'actual_from',
      {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: dayjs(0).format('YYYY-MM-DD'),
      },
      {
        transaction,
      },
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const down: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().removeColumn('Tarifs', 'actual_from', { transaction });

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};
