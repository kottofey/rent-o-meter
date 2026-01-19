import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().createTable(
      'Bills',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },

        bill_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },

        month: {
          type: DataTypes.DATEONLY,
          allowNull: false,
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

        comment: {
          type: DataTypes.STRING,
        },

        renteeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Rentees',
            key: 'id',
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        },

        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.fn('NOW'),
        },
        deletedAt: {
          type: DataTypes.DATE,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.fn('NOW'),
        },
      },
      {
        uniqueKeys: {
          agreement_uniqueness_constraint: {
            fields: ['renteeId', 'month'],
          },
        },
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
    await sequelize.getQueryInterface().dropTable('Bills');

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};
