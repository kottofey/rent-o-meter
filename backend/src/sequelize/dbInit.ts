import { Sequelize } from 'sequelize-typescript';

import options from './seqOptions';

import { Agreement, Rentee, PayMonth, Tarif } from '@/models';

export const sequelize = new Sequelize({
  ...options,
  models: [Rentee, Agreement, PayMonth, Tarif],
});
