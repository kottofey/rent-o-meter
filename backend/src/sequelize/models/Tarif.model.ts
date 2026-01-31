import { Model, Table, Column, NotNull, Scopes, BelongsToMany } from 'sequelize-typescript';
import { DataTypes, Op } from 'sequelize';

import { Bill, RelBillTarifs } from '@/models';
import { dayjs } from '@/helpers';

export type ITarifTypes =
  | 'electricity'
  | 'electricity_over_150kw'
  | 'water_in'
  | 'water_out'
  | 'heat'
  | 'gas'
  | 'renovation'
  | 'tko'
  | 'managing_company'
  | 'domofon';

@Scopes(() => ({
  'tarif:actualOnDate'(actualOn: number) {
    return {
      where: {
        valid_from: {
          [Op.lte]: actualOn,
        },
        valid_to: {
          [Op.or]: {
            [Op.gt]: actualOn,
            [Op.eq]: null,
          },
        },
      },
    };
  },
  'tarif:byType'(tarif_type: ITarifTypes) {
    return {
      where: { tarif_type },
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
  declare tarif_type: ITarifTypes;

  @NotNull
  @Column({ type: DataTypes.NUMBER, allowNull: false })
  set rate(value: number) {
    this.setDataValue('rate', value);
  }
  get rate() {
    const raw: string = this.getDataValue('rate') as string;
    return parseFloat(raw);
  }
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

  @BelongsToMany(() => Bill, () => RelBillTarifs)
  bills: (Bill & { RelBillTarifs: RelBillTarifs })[];
}
