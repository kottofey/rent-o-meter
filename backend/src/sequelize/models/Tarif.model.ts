import { Model, Table, Column, NotNull, HasMany, Scopes } from 'sequelize-typescript';
import { DataTypes, Op } from 'sequelize';

import { Bill } from '@/models';
import { dayjs } from '@/helpers';

@Scopes(() => ({
  'tarif:actualOnDate'(actualFrom: number) {
    return {
      where: {
        valid_from: {
          [Op.lte]: actualFrom,
        },
        valid_to: {
          [Op.or]: {
            [Op.gt]: actualFrom,
            [Op.eq]: null,
          },
        },
      },
    };
  },
}))
@Table({ paranoid: true })
export default class Tarif extends Model {
  @NotNull
  @Column({
    type: DataTypes.ENUM(
      'electricity',
      'electricity_over_150kw',
      'water_in',
      'water_out',
      'heat',
      'gas',
      'renovation',
      'tko',
      'managing_company',
      'domofon',
    ),
    allowNull: false,
  })
  declare tarif_type: string;

  @NotNull
  @Column({ type: DataTypes.NUMBER, allowNull: false })
  declare rate: number;

  @NotNull
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  set valid_from(date: number) {
    this.setDataValue('valid_from', dayjs(date).toDate());
  }
  get valid_from() {
    const raw: string = this.getDataValue('valid_from') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @Column({ type: DataTypes.DATEONLY, allowNull: true, defaultValue: null })
  set valid_to(date: number | null) {
    this.setDataValue('valid_to', date !== null ? dayjs(date).toDate() : null);
  }
  get valid_to() {
    const raw: string = this.getDataValue('valid_to') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @Column(DataTypes.TEXT)
  declare comment: string;

  // -----------------------------------------------------------------------------
  // Virtual
  // -----------------------------------------------------------------------------

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------
  @HasMany(() => Bill, { onDelete: 'CASCADE' })
  bills: Bill[];
}
