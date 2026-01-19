import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

import { dayjs } from '@/helpers';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().removeColumn('Bills', 'water', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'electricity', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'heat', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'gas', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'renovation', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'tko', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'managing_company', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'domofon', { transaction });

    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'ammount',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      {
        transaction,
      },
    );

    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'extra_ammount',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await sequelize.getQueryInterface().removeColumn('Bills', 'ammount', { transaction });
    await sequelize.getQueryInterface().removeColumn('Bills', 'extra_ammount', { transaction });

    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'water',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      {
        transaction,
      },
    );

    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'electricity',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      {
        transaction,
      },
    );

    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'heat',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      {
        transaction,
      },
    );

    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'gas',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      {
        transaction,
      },
    );

    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'renovation',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      {
        transaction,
      },
    );

    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'tko',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      {
        transaction,
      },
    );

    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'managing_company',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      {
        transaction,
      },
    );

    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'domofon',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
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
