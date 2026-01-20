import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().removeColumn('Bills', 'penalty', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'debt', { transaction });

    await sequelize.getQueryInterface().addColumn(
      'Agreements',
      'penalty',
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      {
        transaction,
      },
    );

    await sequelize.getQueryInterface().addColumn(
      'Agreements',
      'debt',
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
    await sequelize.getQueryInterface().removeColumn('Agreements', 'debt', { transaction });
    await sequelize.getQueryInterface().removeColumn('Agreements', 'penalty', { transaction });

    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'debt',
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      {
        transaction,
      },
    );
    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'penalty',
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      {
        transaction,
      },
    );

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};
