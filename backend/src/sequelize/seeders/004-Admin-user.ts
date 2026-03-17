import { Op, QueryInterface } from 'sequelize';

import { type SeederModule } from '../../tools/seed.ts';

import { sequelize } from '@/sequelize';
import { RelUserRole, User } from '@/models';

const seeder: SeederModule = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await sequelize.transaction();

    await User.create(
      {
        id: 1,
        surname: 'Лавров',
        firstname: 'Роман',
        patronymic: 'Дмитриевич',
        email: 'romeokontakt@yandex.ru',
        password: '$2b$10$4cWkx2xe9SnvUu2tHLj.nO51c2CqzPebLrDr.HpR2e2MwVkwxUUkm',
      },
      { transaction },
    );

    await RelUserRole.create(
      {
        role_id: 1,
        user_id: 1,
      },
      { transaction },
    );

    await transaction.commit();
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await sequelize.transaction();

    await User.destroy({
      where: {
        id: 1,
      },
      transaction,
    });

    await RelUserRole.destroy({
      where: {
        role_id: 1,
        user_id: 1,
      },
      transaction,
    });

    await transaction.commit();
  },
};

export default seeder;
