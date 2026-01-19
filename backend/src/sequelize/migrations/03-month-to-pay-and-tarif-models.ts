import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.getQueryInterface().createTable(
    'Tarifs',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
        tarif_uniqueness_constraint: {
          fields: [
            'water',
            'electricity',
            'heat',
            'gas',
            'renovation',
            'tko',
            'managing_company',
            'domofon',
          ],
        },
      },
    },
  );

  await sequelize.getQueryInterface().createTable(
    'Counters',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      // формат 'YYYY-MM-01', всегда первое число месяца за который идет оплата
      // Из этого нужен только месяц
      month: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      // С какого числа расчет
      date_start: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      // По какое число расчет
      date_end: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      agreementId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Agreements',
          key: 'id',
        },
      },

      // Статус Оплачено/не оплачено
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },

      counter_water: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      counter_electricity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // мало ли тариф изменится посреди года
      tarifId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tarifs',
          key: 'id',
        },
      },

      // Пеня
      penalty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      // (+) переплата, (-) задолженность
      debt: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
        counter_uniqueness_constraint: {
          fields: ['agreementId', 'month'],
        },
      },
    },
  );
};

export const down: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.getQueryInterface().dropTable('Counters');
  await sequelize.getQueryInterface().dropTable('Tarifs');
};
