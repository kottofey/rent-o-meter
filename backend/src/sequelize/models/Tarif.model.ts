import { Model, Table, Column, NotNull, HasMany, Scopes } from 'sequelize-typescript';
import { DataTypes, Op } from 'sequelize';

import { Bill } from '@/models';
import { dayjs } from '@/helpers';

@Scopes(() => ({
  actualFrom(actualFrom: number) {
    return {
      where: {
        actual_from: {
          [Op.lte]: actualFrom,
        },
      },
      limit: 1,
      order: [['actual_from', 'DESC']],
    };
  },
}))
@Table({ paranoid: true })
export default class Tarif extends Model {
  @NotNull
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  set actual_from(date: number) {
    this.setDataValue('actual_from', dayjs(date).toDate());
  }
  get actual_from() {
    const raw: string = this.getDataValue('actual_from') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare water: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare electricity: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare electricity_over_150kw: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare heat: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare gas: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare renovation: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare tko: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare managing_company: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare domofon: string;

  @Column(DataTypes.TEXT)
  declare comment: string;

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------
  @HasMany(() => Bill, { onDelete: 'CASCADE' })
  bills: Bill[];
}
