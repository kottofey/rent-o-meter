import { Model, Table, Column, ForeignKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { Bill, Tarif } from '@/models';

@Table({ paranoid: false, timestamps: false, tableName: 'RelBillTarifs' })
export default class RelBillTarifs extends Model {
  @ForeignKey(() => Bill)
  @Column(DataTypes.INTEGER)
  declare billId: number;

  @ForeignKey(() => Tarif)
  @Column(DataTypes.INTEGER)
  declare tarifId: number;
}
