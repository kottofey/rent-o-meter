import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().changeColumn(
      'Tarifs',
      'rate',
      {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      { transaction },
    );

    await sequelize.getQueryInterface().changeColumn(
      'Agreements',
      'penalty',
      {
        type: DataTypes.DECIMAL(8, 2),
      },
      { transaction },
    );
    await sequelize.getQueryInterface().changeColumn(
      'Agreements',
      'debt',
      {
        type: DataTypes.DECIMAL(8, 2),
      },
      { transaction },
    );

    await sequelize.query('UPDATE `Tarifs` SET `Tarifs`.`rate` = `Tarifs`.`rate` / 100', {
      transaction,
    });
    await sequelize.query(
      'UPDATE `Agreements` SET `Agreements`.`penalty` = `Agreements`.`penalty` / 100',
      { transaction },
    );
    await sequelize.query(
      'UPDATE `Agreements` SET `Agreements`.`debt` = `Agreements`.`debt` / 100',
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
    await sequelize.query('UPDATE `Tarifs` SET `Tarifs`.`rate` = `Tarifs`.`rate` * 100', {
      transaction,
    });
    await sequelize.query(
      'UPDATE `Agreements` SET `Agreements`.`penalty` = `Agreements`.`penalty` * 100',
      { transaction },
    );
    await sequelize.query(
      'UPDATE `Agreements` SET `Agreements`.`debt` = `Agreements`.`debt` * 100',
      { transaction },
    );

    await sequelize.getQueryInterface().changeColumn(
      'Tarifs',
      'rate',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      { transaction },
    );

    await sequelize.getQueryInterface().changeColumn(
      'Agreements',
      'penalty',
      {
        type: DataTypes.INTEGER,
      },
      { transaction },
    );
    await sequelize.getQueryInterface().changeColumn(
      'Agreements',
      'debt',
      {
        type: DataTypes.INTEGER,
      },
      { transaction },
    );

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};
