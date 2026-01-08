import { Sequelize } from 'sequelize-typescript';

import options from './seqOptions';

import { Rentee } from '@/models';

export const sequelize = new Sequelize({
  ...options,
  models: [Rentee],
});
