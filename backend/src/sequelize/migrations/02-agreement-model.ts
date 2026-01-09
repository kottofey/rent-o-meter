import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.getQueryInterface().createTable(
    'Agreements',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      renteeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Rentees',
          key: 'id',
        },
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },

      date_start: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      date_end: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      comment: {
        type: DataTypes.STRING,
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
          fields: ['renteeId', 'name'],
        },
      },
    },
  );
};

export const down: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.getQueryInterface().dropTable('Agreements');
};
