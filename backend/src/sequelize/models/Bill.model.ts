import { Model, Table, Column, NotNull, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { Rentee } from '@/models';
import { dayjs } from '@/helpers';

@Table({ paranoid: true })
export default class Bill extends Model {
  @NotNull
  @Column({ type: DataTypes.BOOLEAN, allowNull: false })
  declare status: string;

  @NotNull
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  set bill_date(date: number) {
    this.setDataValue('bill_date', dayjs(date).toDate());
  }
  get bill_date() {
    const raw: string = this.getDataValue('bill_date') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @NotNull
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  set month(date: number) {
    this.setDataValue('month', dayjs(date).startOf('month').toDate());
  }
  get month() {
    const raw: string = this.getDataValue('month') as string;
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
  @NotNull
  @ForeignKey(() => Rentee)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare renteeId: number;

  @BelongsTo(() => Rentee, { onDelete: 'Restrict' })
  rentee: Rentee;
}
