import { QueryInterface } from 'sequelize';

import { type SeederModule } from '../../tools/seed.ts';

import { sequelize } from '@/sequelize';

const seeder: SeederModule = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        'Roles',
        [
          {
            name: 'admin',
            description: 'Администратор системы - полный доступ ко всем функциям',
            status: true,
          },
          {
            name: 'rentee',
            description: 'Арендатор - просмотр счетов, ввод показаний счетчиков',
            status: true,
          },
          {
            name: 'viewer',
            description: 'Только просмотр - доступ только для чтения',
            status: true,
          },
        ],
        { transaction },
      );

      await transaction.commit();
    } catch (e) {
      console.error(e);
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      await queryInterface.bulkDelete(
        'Roles',
        [
          {
            name: 'admin',
            description: 'Администратор системы - полный доступ ко всем функциям',
            status: true,
          },
          {
            name: 'rentee',
            description: 'Арендатор - просмотр счетов, ввод показаний счетчиков',
            status: true,
          },
          {
            name: 'viewer',
            description: 'Только просмотр - доступ только для чтения',
            status: true,
          },
        ],
        { transaction },
      );

      await transaction.commit();
    } catch (e) {
      console.error(e);
    }
  },
};

export default seeder;
