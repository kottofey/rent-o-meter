import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize
      .getQueryInterface()
      .removeConstraint('Bills', 'Bills_tarifId_foreign_idx', { transaction });
    await sequelize
      .getQueryInterface()
      .removeIndex('Bills', 'Bills_tarifId_foreign_idx', { transaction });
    await sequelize.getQueryInterface().dropTable('Tarifs', { transaction });

    await sequelize.query('UPDATE `Bills` SET tarifId = NULL WHERE tarifId IS NOT NULL');

    await sequelize.getQueryInterface().createTable(
      'Tarifs',
      {
        id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          autoIncrement: true,
        },

        tarif_type: {
          allowNull: false,
          type: DataTypes.ENUM(
            'electricity',
            'electricity_over_150kw',
            'water_in',
            'water_out',
            'heat',
            'gas',
            'renovation',
            'tko',
            'managing_company',
            'domofon',
          ),
        },
        rate: DataTypes.INTEGER,
        valid_from: DataTypes.DATEONLY,
        valid_to: DataTypes.DATEONLY,
        comment: DataTypes.STRING,

        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.fn('NOW'),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.fn('NOW'),
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        },
      },
      { transaction },
    );

    await sequelize.getQueryInterface().addConstraint('Bills', {
      fields: ['tarifId'],
      type: 'foreign key',
      name: 'Bills_tarifId_foreign_idx',
      references: {
        table: 'Tarifs',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      transaction,
    });

    await sequelize.getQueryInterface().addIndex('Bills', ['tarifId'], {
      name: 'Bills_tarifId_foreign_idx',
      transaction,
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
    await sequelize
      .getQueryInterface()
      .removeConstraint('Bills', 'Bills_tarifId_foreign_idx', { transaction });
    await sequelize
      .getQueryInterface()
      .removeIndex('Bills', 'Bills_tarifId_foreign_idx', { transaction });
    await sequelize.getQueryInterface().dropTable('Tarifs', { transaction });

    await sequelize.query('UPDATE `Bills` SET tarifId = NULL WHERE tarifId IS NOT NULL');

    await sequelize.getQueryInterface().createTable(
      'Tarifs',
      {
        id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          autoIncrement: true,
        },
        comment: {
          type: DataTypes.STRING,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        },
        actual_from: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        water: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        electricity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        heat: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        gas: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        renovation: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        tko: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        managing_company: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        domofon: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        electricity_over_150kw: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      { transaction, charset: 'utf8mb4' },
    );

    await sequelize.getQueryInterface().addConstraint('Bills', {
      fields: ['tarifId'],
      type: 'foreign key',
      name: 'Bills_tarifId_foreign_idx',
      references: {
        table: 'Tarifs',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      transaction,
    });

    await sequelize.getQueryInterface().addIndex('Bills', ['tarifId'], {
      name: 'Bills_tarifId_foreign_idx',
      transaction,
    });

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};
