import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

import { RelBillTarifs } from '@/models';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().changeColumn(
      'Bills',
      'ammount',
      {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      { transaction },
    );

    await sequelize.getQueryInterface().changeColumn(
      'Bills',
      'extra_ammount',
      {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      { transaction },
    );

    await sequelize.getQueryInterface().changeColumn(
      'Bills',
      'ammount_paid',
      {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
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
    await sequelize.getQueryInterface().changeColumn(
      'Bills',
      'ammount',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      { transaction },
    );

    await sequelize.getQueryInterface().changeColumn(
      'Bills',
      'extra_ammount',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      { transaction },
    );

    await sequelize.getQueryInterface().changeColumn(
      'Bills',
      'ammount_paid',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      { transaction },
    );

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};
