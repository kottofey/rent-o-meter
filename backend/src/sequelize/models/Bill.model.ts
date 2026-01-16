import { Model, Table, Column, NotNull, ForeignKey, BelongsTo, Scopes } from 'sequelize-typescript';
import { DataTypes, Op } from 'sequelize';

import { Rentee } from '@/models';
import { dayjs } from '@/helpers';

@Scopes(() => ({
  isBillsDebt() {
    return {
      where: {
        status: {
          [Op.eq]: false,
        },
      },
    };
  },
}))
@Table({ paranoid: true })
export default class Bill extends Model {
  @NotNull
  @Column({ type: DataTypes.BOOLEAN, allowNull: false })
  declare status: boolean;

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
  declare water: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare electricity: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare heat: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare gas: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare renovation: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare tko: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare managing_company: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare domofon: number;

  @Column(DataTypes.TEXT)
  declare comment: number;

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
