import type { Sequelize } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'Tarifs',
      'electricity_over_150kw',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      { transaction },
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
    await sequelize
      .getQueryInterface()
      .removeColumn('Tarifs', 'electricity_over_150kw', { transaction });

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};
