import { Op, QueryInterface } from 'sequelize';
import chalk from 'chalk';

import { type SeederModule } from '../../tools/seed.ts';

import { sequelize } from '@/sequelize';
import { Permission, Role } from '@/models';

const calcPermissions = async () => {
  const adminRole = (await sequelize.query("SELECT id FROM Roles WHERE name = 'admin'", {
    type: 'SELECT',
  })) as unknown as [{ id: number }, unknown];

  const renteeRole = (await sequelize.query("SELECT id FROM Roles WHERE name = 'rentee'", {
    type: 'SELECT',
  })) as unknown as [{ id: number }, unknown];

  const viewerRole = (await sequelize.query("SELECT id FROM Roles WHERE name = 'viewer'", {
    type: 'SELECT',
  })) as unknown as [{ id: number }, unknown];

  const adminId = adminRole[0].id;
  const renteeId = renteeRole[0].id;
  const viewerId = viewerRole[0].id;

  // Получаем все разрешения
  const permissions = (await sequelize.query('SELECT id, name FROM Permissions', {
    type: 'SELECT',
  })) as unknown as { id: number; name: string }[];

  // Формируем связи для каждой роли
  const rolePermissions: { role_id: number; permission_id: number }[] = [];

  permissions.forEach(permission => {
    // Admin получает все разрешения
    rolePermissions.push({
      role_id: adminId,
      permission_id: permission.id,
    });

    // Rentee
    if (
      permission.name === 'agreements.read' ||
      permission.name === 'bills.read' ||
      (permission.name.includes('counters.') && !permission.name.includes('.delete')) ||
      permission.name === 'tariffs.read'
    ) {
      rolePermissions.push({
        role_id: renteeId,
        permission_id: permission.id,
      });
    }

    // Viewer только читает
    if (permission.name.includes('.read')) {
      rolePermissions.push({
        role_id: viewerId,
        permission_id: permission.id,
      });
    }
  });

  return rolePermissions;
};

const seeder: SeederModule = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await sequelize.transaction();

    await queryInterface.bulkInsert('RelRolePermissions', await calcPermissions(), { transaction });

    await transaction.commit();
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await sequelize.transaction();

    await queryInterface.bulkDelete(
      'RelRolePermissions',
      {
        [Op.or]: await calcPermissions(),
      },
      { transaction },
    );

    await transaction.commit();
  },
};

export default seeder;
