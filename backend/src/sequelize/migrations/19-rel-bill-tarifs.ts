import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

import { RelBillTarifs } from '@/models';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().createTable(
      'RelBillTarifs',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        billId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        tarifId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        transaction,
        uniqueKeys: {
          unique_constraint: {
            fields: ['billId', 'tarifId'],
          },
        },
      },
    );

    await sequelize.getQueryInterface().addConstraint('RelBillTarifs', {
      name: 'Tarif_FK',
      type: 'foreign key',
      fields: ['tarifId'],
      references: {
        table: 'Tarifs',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      transaction,
    });

    await sequelize.getQueryInterface().addConstraint('RelBillTarifs', {
      name: 'Bills_FK',
      type: 'foreign key',
      fields: ['billId'],
      references: {
        table: 'Bills',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      transaction,
    });

    await sequelize.getQueryInterface().removeColumn('Bills', 'tarifId', { transaction });

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
      .removeConstraint('RelBillTarifs', 'Tarifs_FK', { transaction });
    await sequelize
      .getQueryInterface()
      .removeConstraint('RelBillTarifs', 'Bills_FK', { transaction });
    await sequelize.getQueryInterface().dropTable('RelBillTarifs', { transaction });

    await sequelize.getQueryInterface().addColumn(
      'Bills',
      'tarifId',
      {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      { transaction },
    );
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};
