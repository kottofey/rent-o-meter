import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize
      .getQueryInterface()
      .removeConstraint('Bills', 'Bills_agreementId_foreign_idx', { transaction });

    await sequelize.getQueryInterface().removeIndex('Bills', 'billsUnique', { transaction });

    await sequelize.getQueryInterface().addIndex('Bills', ['agreementId', 'counterId', 'month'], {
      name: 'billsUnique',
      unique: true,
      transaction,
    });

    await sequelize.getQueryInterface().addConstraint('Bills', {
      type: 'foreign key',
      name: 'Bills_agreementId_foreign_idx',
      fields: ['agreementId'],
      references: {
        table: 'Agreements',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      transaction,
    });

    await sequelize.getQueryInterface().changeColumn(
      'Bills',
      'month',
      {
        allowNull: true,
        type: DataTypes.DATE,
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
    await sequelize
      .getQueryInterface()
      .removeConstraint('Bills', 'Bills_agreementId_foreign_idx', { transaction });

    await sequelize.getQueryInterface().removeIndex('Bills', 'billsUnique', { transaction });

    await sequelize.getQueryInterface().addIndex('Bills', ['agreementId', 'month'], {
      name: 'billsUnique',
      unique: true,
      transaction,
    });

    await sequelize.getQueryInterface().addConstraint('Bills', {
      type: 'foreign key',
      name: 'Bills_agreementId_foreign_idx',
      fields: ['agreementId'],
      references: {
        table: 'Agreements',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      transaction,
    });

    await sequelize.getQueryInterface().changeColumn(
      'Bills',
      'month',
      {
        allowNull: false,
        type: DataTypes.DATE,
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
