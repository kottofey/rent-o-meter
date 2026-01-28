import { Sequelize } from 'sequelize-typescript';

import options from './seqOptions';

import { Agreement, Rentee, Counter, Tarif, Bill, RelBillTarifs } from '@/models';

export const sequelize = new Sequelize({
  ...options,
  models: [Agreement, Rentee, Counter, Tarif, Bill, RelBillTarifs],
});
