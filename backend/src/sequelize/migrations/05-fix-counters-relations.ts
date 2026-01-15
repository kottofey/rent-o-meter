import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn(
      'Counters',
      'renteeId',
      {
        type: DataTypes.INTEGER,
        references: {
          model: 'Rentees',
          key: 'id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      {
        transaction,
      },
    );

    await sequelize.query(
      `
          UPDATE Counters
          SET renteeId = (
            SELECT renteeId
            FROM Agreements
            WHERE Agreements.id = Counters.agreementId
          )
          WHERE agreementId IS NOT NULL;
        `,
      { transaction },
    );

    await sequelize.getQueryInterface().removeColumn('Counters', 'agreementId', { transaction });
    await sequelize.getQueryInterface().removeColumn('Counters', 'tarifId', { transaction });

    await sequelize.getQueryInterface().changeColumn(
      'Counters',
      'renteeId',
      {
        type: DataTypes.INTEGER,
        allowNull: false,

        references: {
          model: 'Rentees',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
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
    await sequelize.getQueryInterface().addColumn(
      'Counters',
      'agreementId',
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Agreements',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      { transaction },
    );

    await sequelize.getQueryInterface().addColumn(
      'Counters',
      'tarifId',
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Tarifs',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      { transaction },
    );

    await sequelize.getQueryInterface().removeColumn('Counters', 'renteeId', { transaction });

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }

  // await sequelize.getQueryInterface().addColumn('Counters', 'tarifId', 'INTEGER');
  // await sequelize.getQueryInterface().addColumn('Counters', 'agreementId', 'INTEGER');
  //
  // await sequelize
  //   .getQueryInterface()
  //   .addIndex('Rentees', { fields: ['id'], type: 'UNIQUE', name: '' });
  // await sequelize.query(
  //   'ALTER TABLE `rent-o-meter`.Rentees ADD CONSTRAINT Counters_ibfk_1 FOREIGN KEY (id) REFERENCES `rent-o-meter`.Rentees(id) ON DELETE RESTRICT ON UPDATE CASCADE;',
  // );
  // await sequelize.query(
  //   'ALTER TABLE `rent-o-meter`.Tarifs ADD CONSTRAINT Counters_ibfk_2 FOREIGN KEY (id) REFERENCES `rent-o-meter`.Counters(id) ON DELETE RESTRICT ON UPDATE CASCADE;',
  // );
  //
  // await sequelize.getQueryInterface().removeConstraint('Counters', 'Counters_Tarifs_FK');
  //
  // await sequelize.getQueryInterface().removeColumn('Counters', 'renteeId');
};
