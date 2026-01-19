import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().removeColumn('Counters', 'penalty', { transaction });
    await sequelize.getQueryInterface().removeColumn('Counters', 'debt', { transaction });
    await sequelize.getQueryInterface().removeColumn('Counters', 'status', { transaction });

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

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const down: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().removeColumn('Bills', 'debt', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'penalty', { transaction });

    await sequelize.getQueryInterface().addColumn(
      'Counters',
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
      'Counters',
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
      'Counters',
      'status',
      {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
