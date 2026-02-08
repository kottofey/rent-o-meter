import { Sequelize } from 'sequelize-typescript';

import { options } from '@/sequelize/config';
import {
  Agreement,
  Rentee,
  Counter,
  Tarif,
  Bill,
  RelBillTarifs,
  Seeder,
} from '@/models';

export const sequelize = new Sequelize({
  ...options,
  models: [
    Agreement,
    Rentee,
    Counter,
    Tarif,
    Bill,
    RelBillTarifs,
    Seeder,
  ],
});
