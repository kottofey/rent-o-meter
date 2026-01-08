import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';
import dayjs from 'dayjs';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.getQueryInterface().createTable('Rentees', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patronymic: {
      type: DataTypes.STRING,
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
    },

    phone: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
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
  });
};

export const down: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.getQueryInterface().dropTable('Rentees');
};
