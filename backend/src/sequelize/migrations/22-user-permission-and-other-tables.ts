import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '../../tools/umzug.ts';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    // -----------------------------------------------------------------------------
    // Permissions table
    // -----------------------------------------------------------------------------

    await sequelize.getQueryInterface().createTable(
      'Permissions',
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
        description: {
          type: DataTypes.STRING,
        },
        resource: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        action: {
          type: DataTypes.ENUM('create', 'read', 'update', 'delete', 'manage'),
          allowNull: false,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
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
      { transaction },
    );

    // -----------------------------------------------------------------------------
    // RefreshTokens table
    // -----------------------------------------------------------------------------

    await sequelize.getQueryInterface().createTable(
      'RefreshTokens',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        token_hash: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        is_revoked: {
          type: DataTypes.BOOLEAN,
        },
        user_agent: {
          type: DataTypes.STRING,
        },
        ip: {
          type: DataTypes.STRING,
        },
        device_id: {
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
        transaction,
        uniqueKeys: {
          tokenHashUniqueConstraint: {
            fields: ['token_hash'],
          },
        },
      },
    );

    // -----------------------------------------------------------------------------
    // RelRolePermissions table
    // -----------------------------------------------------------------------------

    await sequelize.getQueryInterface().createTable(
      'RelRolePermissions',
      {
        role_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        permission_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        transaction,
        uniqueKeys: {
          RolePermissionUniqueKeys: {
            fields: ['role_id', 'permission_id'],
          },
        },
      },
    );

    // -----------------------------------------------------------------------------
    // RelUserRoles table
    // -----------------------------------------------------------------------------

    await sequelize.getQueryInterface().createTable(
      'RelUserRoles',
      {
        role_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        transaction,
        uniqueKeys: {
          RolePermissionUniqueKeys: {
            fields: ['role_id', 'user_id'],
          },
        },
      },
    );

    // -----------------------------------------------------------------------------
    // Roles table
    // -----------------------------------------------------------------------------

    await sequelize.getQueryInterface().createTable(
      'Roles',
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
        description: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        transaction,
        uniqueKeys: {
          RolePermissionUniqueKeys: {
            fields: ['name'],
          },
        },
      },
    );

    // -----------------------------------------------------------------------------
    // Users table
    // -----------------------------------------------------------------------------

    await sequelize.getQueryInterface().createTable(
      'Users',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        rentee_id: {
          type: DataTypes.INTEGER,
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
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        last_login: {
          type: DataTypes.DATE,
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
        transaction,
        uniqueKeys: {
          EmailUniqueKey: {
            fields: ['email'],
          },
        },
      },
    );

    // -----------------------------------------------------------------------------
    // Restrictions
    // -----------------------------------------------------------------------------

    await sequelize.getQueryInterface().addConstraint('RefreshTokens', {
      transaction,
      type: 'foreign key',
      name: 'FK_RefreshTokens_user_id_Users_id',
      fields: ['user_id'],
      references: {
        table: 'Users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await sequelize.getQueryInterface().addConstraint('Users', {
      transaction,
      type: 'foreign key',
      name: 'FK_Users_rentee_id_Rentees_id',
      fields: ['rentee_id'],
      references: {
        table: 'Rentees',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await sequelize.getQueryInterface().addConstraint('RelRolePermissions', {
      transaction,
      type: 'foreign key',
      name: 'FK_RelRolePermissions_role_id_Roles_id',
      fields: ['role_id'],
      references: {
        table: 'Roles',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await sequelize.getQueryInterface().addConstraint('RelRolePermissions', {
      transaction,
      type: 'foreign key',
      name: 'FK_RelRolePermissions_permission_id_Permissions_id',
      fields: ['permission_id'],
      references: {
        table: 'Permissions',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await sequelize.getQueryInterface().addConstraint('RelUserRoles', {
      transaction,
      type: 'foreign key',
      name: 'FK_RelUserRoles_role_id_Roles_id',
      fields: ['role_id'],
      references: {
        table: 'Roles',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await sequelize.getQueryInterface().addConstraint('RelUserRoles', {
      transaction,
      type: 'foreign key',
      name: 'FK_RelUserRoles_user_id_Users_id',
      fields: ['user_id'],
      references: {
        table: 'Users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
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
      .removeConstraint('RelRolePermissions', 'FK_RelRolePermissions_role_id_Roles_id', {
        transaction,
      });
    await sequelize
      .getQueryInterface()
      .removeConstraint(
        'RelRolePermissions',
        'FK_RelRolePermissions_permission_id_Permissions_id',
        { transaction },
      );
    await sequelize
      .getQueryInterface()
      .removeConstraint('RelUserRoles', 'FK_RelUserRoles_role_id_Roles_id', { transaction });
    await sequelize
      .getQueryInterface()
      .removeConstraint('RelUserRoles', 'FK_RelUserRoles_user_id_Users_id', { transaction });
    await sequelize
      .getQueryInterface()
      .removeConstraint('Users', 'FK_Users_rentee_id_Rentees_id', { transaction });

    await sequelize.getQueryInterface().dropTable('RefreshTokens', { transaction });
    await sequelize.getQueryInterface().dropTable('RelRolePermissions', { transaction });
    await sequelize.getQueryInterface().dropTable('RelUserRoles', { transaction });
    await sequelize.getQueryInterface().dropTable('Permissions', { transaction });
    await sequelize.getQueryInterface().dropTable('Roles', { transaction });
    await sequelize.getQueryInterface().dropTable('Users', { transaction });
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};
