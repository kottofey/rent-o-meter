import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().removeColumn('Counters', 'tarifId', { transaction });
    await sequelize.getQueryInterface().removeColumn('Counters', 'renteeId', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'renteeId', { transaction });

    await sequelize.getQueryInterface().addColumn(
      'Counters',
      'agreementId',
      {
        type: DataTypes.INTEGER,
        references: {
          model: 'Agreements',
          key: 'id',
        },
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
      'counterId',
      {
        type: DataTypes.INTEGER,
        references: {
          model: 'Counters',
          key: 'id',
        },
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
      'tarifId',
      {
        type: DataTypes.INTEGER,
        references: {
          model: 'Tarifs',
          key: 'id',
        },
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
      'agreementId',
      {
        type: DataTypes.INTEGER,
        references: {
          model: 'Agreements',
          key: 'id',
        },
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
    await sequelize.getQueryInterface().addColumn(
      'Counters',
      'tarifId',
      {
        type: DataTypes.INTEGER,
        references: {
          model: 'Tarifs',
          key: 'id',
        },
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
      'renteeId',
      {
        type: DataTypes.INTEGER,
        references: {
          model: 'Rentees',
          key: 'id',
        },
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
      'renteeId',
      {
        type: DataTypes.INTEGER,
        references: {
          model: 'Rentees',
          key: 'id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      {
        transaction,
      },
    );

    await sequelize.getQueryInterface().removeColumn('Counters', 'agreementId', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'counterId', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'tarifId', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'agreementId', { transaction });

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};
